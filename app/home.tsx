
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function HomePage() {
    const { user } = useLocalSearchParams();
    const parsedUser = user ? JSON.parse(user as string) : null;
    const router = useRouter();

    const handleSignOut = () => {
        Alert.alert('Signed out');
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hello World</Text>
            <Text style={styles.subtitle}>Welcome, {parsedUser?.user_metadata?.user_name || parsedUser?.email}</Text>
            <Text style={styles.date}>Member uuid: {parsedUser?.id}</Text>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        marginBottom: 20,
        color: '#555',
    },
});