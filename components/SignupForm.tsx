import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onSubmit: (username: string, email: string, password: string) => void;
  onToggle: () => void;
  error: string;
};

export default function SignUpForm({ onSubmit, onToggle, error }: Props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateInput = () => {
    if (!username) {
      setLocalError('Full name is required.');
      return false;
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return false;
    }
    setLocalError('');
    return true;
  };

  const handlePress = () => {
    if (validateInput()) {
      onSubmit(username, email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#FF6600"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm your password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#FF6600"
          />
        </TouchableOpacity>
      </View>

      {localError ? <Text style={styles.error}>{localError}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={styles.linkLabel}>Already have an account? </Text>
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.linkText}>Login</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 8,
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