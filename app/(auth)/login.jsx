import { Pressable, StyleSheet , Text} from 'react-native'
import {Link} from 'expo-router';
import { Colors } from '../../constants/Colors';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import Spacer from '../../components/Spacer';




const Login = () => {

    const handleSubmit = () => {
        console.log('loging form submitted')
    }
  return (
   <ThemedView style={styles.container}>

    <Spacer />
    <ThemedText title={true} style={styles.title}>
        Login to your account
    </ThemedText>

    <Pressable 
        onPress={handleSubmit}
        style={({pressed}) => [styles.btn, pressed && styles.pressed ]}>
        <Text style={{color: '#f2f2f2' }}>Login</Text>

    </Pressable>
     

   </ThemedView>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        marginBottom: 30
    },
    btn: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 5,
      },
      pressed: {
        opacity: 0.8,
      },
      
})