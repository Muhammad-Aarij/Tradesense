import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API Keys - Replace with your actual keys
const REVENUECAT_API_KEYS = {
  ios: 'your_ios_api_key_here',
  android: 'your_android_api_key_here'
};

// Product IDs - Replace with your actual product IDs
export const PRODUCT_IDS = {
  MONTHLY_SUBSCRIPTION: 'monthly_subscription',
  YEARLY_SUBSCRIPTION: 'yearly_subscription',
  LIFETIME_ACCESS: 'lifetime_access'
};

// Entitlement IDs - Replace with your actual entitlement IDs
export const ENTITLEMENT_IDS = {
  PREMIUM_ACCESS: 'premium_access'
};

class RevenueCatService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize(userId = null) {
    try {
      if (this.isInitialized) {
        return;
      }

      // Configure RevenueCat
      await Purchases.configure({
        apiKey: Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android,
        appUserID: userId,
        observerMode: false, // Set to true for testing without making actual purchases
      });

      this.isInitialized = true;
      console.log('RevenueCat initialized successfully');
    } catch (error) {
      console.error('RevenueCat initialization failed:', error);
      throw error;
    }
  }

  async setUser(userId) {
    try {
      if (!this.isInitialized) {
        await this.initialize(userId);
      } else {
        await Purchases.logIn(userId);
      }
      console.log('RevenueCat user set:', userId);
    } catch (error) {
      console.error('Failed to set RevenueCat user:', error);
      throw error;
    }
  }

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }

  async purchasePackage(packageToPurchase) {
    try {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases() {
    try {
      const { customerInfo } = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      throw error;
    }
  }

  async getCustomerInfo() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  }

  async checkSubscriptionStatus() {
    try {
      const customerInfo = await this.getCustomerInfo();
      const isSubscribed = customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM_ACCESS] !== undefined;
      return {
        isSubscribed,
        customerInfo,
        activeEntitlements: customerInfo.entitlements.active
      };
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return {
        isSubscribed: false,
        customerInfo: null,
        activeEntitlements: {}
      };
    }
  }

  async getActiveSubscription() {
    try {
      const customerInfo = await this.getCustomerInfo();
      const activeSubscription = customerInfo.entitlements.active[ENTITLEMENT_IDS.PREMIUM_ACCESS];
      return activeSubscription;
    } catch (error) {
      console.error('Failed to get active subscription:', error);
      return null;
    }
  }
}

export default new RevenueCatService(); 