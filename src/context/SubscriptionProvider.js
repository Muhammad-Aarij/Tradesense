import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import RevenueCatService from '../config/revenueCat';

const SubscriptionContext = createContext();

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [activeEntitlements, setActiveEntitlements] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = useSelector(state => state.auth);
  const userId = userData?.userObject?._id;

  useEffect(() => {
    if (userId) {
      initializeSubscription();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const initializeSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize RevenueCat with user
      await RevenueCatService.setUser(userId);
      
      // Check subscription status
      const status = await RevenueCatService.checkSubscriptionStatus();
      
      setIsSubscribed(status.isSubscribed);
      setCustomerInfo(status.customerInfo);
      setActiveEntitlements(status.activeEntitlements);
    } catch (err) {
      setError(err.message);
      console.error('Failed to initialize subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    try {
      const status = await RevenueCatService.checkSubscriptionStatus();
      setIsSubscribed(status.isSubscribed);
      setCustomerInfo(status.customerInfo);
      setActiveEntitlements(status.activeEntitlements);
    } catch (err) {
      setError(err.message);
      console.error('Failed to refresh subscription status:', err);
    }
  };

  const purchasePackage = async (packageToPurchase) => {
    try {
      setIsLoading(true);
      setError(null);

      const customerInfo = await RevenueCatService.purchasePackage(packageToPurchase);
      
      // Update subscription status after successful purchase
      await refreshSubscriptionStatus();
      
      return customerInfo;
    } catch (err) {
      setError(err.message);
      console.error('Purchase failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const customerInfo = await RevenueCatService.restorePurchases();
      
      // Update subscription status after restore
      await refreshSubscriptionStatus();
      
      return customerInfo;
    } catch (err) {
      setError(err.message);
      console.error('Restore purchases failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isSubscribed,
    customerInfo,
    activeEntitlements,
    isLoading,
    error,
    purchasePackage,
    restorePurchases,
    refreshSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 