import Purchases from 'react-native-purchases';

/**
 * Checks the subscription status of the user using RevenueCat
 * @returns {Promise<boolean>} true if user has an active subscription, false otherwise
 */
export const checkSubscriptionStatus = async () => {
  try {
    // Fetch the customer info from RevenueCat
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('Customer Info:', customerInfo);

    // Replace with your actual entitlement ID set in RevenueCat dashboard
    const entitlementId = 'Premium Courses Access';

    const activeEntitlement = customerInfo.entitlements.active[entitlementId];

    if (activeEntitlement) {
      console.log('User has an active subscription:', activeEntitlement);
      return true;
    } else {
      console.log('User does NOT have an active subscription.');
      return false;
    }

  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};
