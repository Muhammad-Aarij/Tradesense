import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { bg, CheckMark } from '../../../assets/images';
import Header from '../../../components/Header';
import theme from '../../../themes/theme';

const PlanCard = ({ title, price, features, onPress, isSelected, navigation }) => (
    <TouchableOpacity
        style={[styles.planCard, isSelected && styles.planCardSelected]}
        onPress={onPress}
    >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.planTitle}>{title}</Text>
            <Text style={styles.planPrice}>{price}</Text>
        </View>
        <View style={{ width: "100%", marginBottom: 15, borderTopWidth: 1, borderColor: "rgba(209, 209, 209, 0.46)" }} />

        <Text style={{ ...styles.featureText, marginLeft: 0, marginBottom: 15, }}>Single Payment plan to get immediate access to audios</Text>
        <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                    <Image source={CheckMark} style={{ width: 20, height: 20, resizeMode: "contain" }} />
                    <Text style={styles.featureText}>{feature}</Text>
                </View>
            ))}
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => { navigation.navigate("CheckoutScreen") }}>
            <Text style={styles.checkoutButtonText}>Join</Text>
        </TouchableOpacity>
    </TouchableOpacity>
);

const PlansScreen = ({ navigation }) => {
    //   const navigation = useNavigation(); sty

    const [selectedPlan, setSelectedPlan] = useState('single'); // 'single' or 'monthly'

    return (
        <ImageBackground source={bg} style={styles.container}>
            {/* Header */}
            <Header title={"Memberships"} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Single Payment Plan */}
                <PlanCard
                    title="Single Payment"
                    price="$1450"
                    features={['Life Time Access', '3 Bonus Audios', 'Lack of basic Needs']}
                    onPress={() => setSelectedPlan('single')}
                    isSelected={selectedPlan === 'single'}
                    navigation={navigation}
                />

                {/* Monthly Payment Plan */}
                <PlanCard
                    navigation={navigation}
                    title="2x Monthly Payment"
                    price="$750"
                    features={['Life Time Access', 'Sequential Access', 'Premium Support']}
                    onPress={() => setSelectedPlan('monthly')}
                    isSelected={selectedPlan === 'monthly'}
                />


            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingBottom: 0,
    },

    scrollContent: {
        paddingBottom: 30, // Extra space at the bottom
    },
    planCard: {
        padding: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 0.9, borderColor: theme.borderColor,
        borderRadius: 15, marginBottom: 25,
    },
    planCardSelected: {
        // borderColor: theme.primaryColor, // Highlight selected card
    },
    planTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: "Inter-Bold",
        marginBottom: 10,
    },
    planPrice: {
        color: theme.primaryColor,
        fontSize: 19,
        fontFamily: "Inter-Bold",
        marginBottom: 15,
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        color: '#FFFFFF',
        fontSize: 14,
        marginLeft: 10,
    },

    checkoutButton: {
        backgroundColor: theme.primaryColor, width: '100%',
        padding: 12, borderRadius: 11, marginTop: 20, alignItems: 'center'
    },
    checkoutButtonText: {
        color: '#fff', fontSize: 15, fontWeight: '600', fontFamily: "Inter-SemiBold",

    },
});

export default PlansScreen;
