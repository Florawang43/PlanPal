import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignupForm';
import { signInWithEmail, signUpNewUser } from '../utils/auth';
import { } from '../services/user_profile_service';

export default function App() {
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [error, setError] = useState('');
    const [prefilledEmail, setPrefilledEmail] = useState('disilucy@gmail.com');
    const [prefilledPassword, setPrefilledPassword] = useState('test1234');
    const router = useRouter();

    const handleSignIn = async (email: string, password: string) => {
        setError('');
        try {
            const user = await signInWithEmail(email, password);
            if (user) {
                router.replace({ pathname: '/home', params: { user: JSON.stringify(user) } });
            } else {
                setError('Sign in failed.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleSignUp = async (username: string, email: string, password: string) => {
        setError('');
        try {
            const user = await signUpNewUser(username, email, password);
            if (user) {
                setPrefilledEmail(email);
                setPrefilledPassword(password);
                setIsSigningIn(true);
            } else {
                setError('Sign up failed.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            {isSigningIn ? (
                <SignInForm onSubmit={handleSignIn} error={error} onToggle={() => setIsSigningIn(false)} defaultEmail={prefilledEmail} defaultPassword={prefilledPassword} />
            ) : (
                <SignUpForm onSubmit={handleSignUp} error={error} onToggle={() => setIsSigningIn(true)} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
});