import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  onSubmit: (email: string, password: string) => void;
  onToggle: () => void;
  error: string;
  defaultEmail: string;
  defaultPassword: string;
};

export default function SignInForm({
  onSubmit,
  onToggle,
  error,
  defaultEmail = '',
  defaultPassword = '',
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);
  }, [defaultEmail, defaultPassword]);

  const validateInput = () => {
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return false;
    }
    setLocalError('');
    return true;
  };

  const handlePress = () => {
    if (validateInput()) {
      onSubmit(email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Enter your email and password</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {localError ? <Text style={styles.error}>{localError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkLabel}>Don't have an account? </Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.linkText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  linkLabel: {
    fontSize: 14,
    color: '#555',
  },
  linkText: {
    fontSize: 14,
    color: '#FF6600',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});