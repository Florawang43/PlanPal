import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
    onSubmit: (email: string, password: string) => void;
    onToggle: () => void;
    error: string;
    defaultEmail: string;
    defaultPassword: string;
};

export default function SignInForm({ onSubmit, onToggle, error, defaultEmail='', defaultPassword='' }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        setEmail(defaultEmail);
        setPassword(defaultPassword);
    }, [defaultEmail, defaultPassword]);

    const handlePress = () => {
        if (!email || !password) return;
        onSubmit(email, password);
    };

    return (
        <View style={styles.box}>
            <Text style={styles.title}>Sign In</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button title="Sign In" onPress={handlePress} />

            <TouchableOpacity onPress={onToggle} style={styles.toggleLink}>
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    toggleLink: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
});