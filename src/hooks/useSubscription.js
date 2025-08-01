import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import RevenueCatService from '../config/revenueCat';

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    customerInfo: null,
    activeEntitlements: {}
  });
  const [error, setError] = useState(null);

  const userData = useSelector(state => state.auth);
  const userId = userData?.userObject?._id;

  // Initialize RevenueCat when user is available
  useEffect(() => {
    if (userId) {
      initializeRevenueCat();
    }
  }, [userId]);

  const initializeRevenueCat = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await RevenueCatService.setUser(userId);
      await loadOfferings();
      await checkSubscriptionStatus();
    } catch (err) {
      setError(err.message);
      console.error('Failed to initialize RevenueCat:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadOfferings = useCallback(async () => {
    try {
      const offeringsData = await RevenueCatService.getOfferings();
      setOfferings(offeringsData);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load offerings:', err);
    }
  }, []);

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const status = await RevenueCatService.checkSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (err) {
      setError(err.message);
      console.error('Failed to check subscription status:', err);
    }
  }, []);

  const purchasePackage = useCallback(async (packageToPurchase) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const customerInfo = await RevenueCatService.purchasePackage(packageToPurchase);
      
      // Update subscription status after successful purchase
      await checkSubscriptionStatus();
      
      return customerInfo;
    } catch (err) {
      setError(err.message);
      console.error('Purchase failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkSubscriptionStatus]);

  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const customerInfo = await RevenueCatService.restorePurchases();
      
      // Update subscription status after restore
      await checkSubscriptionStatus();
      
      return customerInfo;
    } catch (err) {
      setError(err.message);
      console.error('Restore purchases failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [checkSubscriptionStatus]);

  const refreshSubscriptionStatus = useCallback(async () => {
    await checkSubscriptionStatus();
  }, [checkSubscriptionStatus]);

  return {
    isLoading,
    offerings,
    subscriptionStatus,
    error,
    purchasePackage,
    restorePurchases,
    refreshSubscriptionStatus,
    isSubscribed: subscriptionStatus.isSubscribed,
    customerInfo: subscriptionStatus.customerInfo,
    activeEntitlements: subscriptionStatus.activeEntitlements
  };
}; 