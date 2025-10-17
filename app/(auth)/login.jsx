import { Pressable, StyleSheet , Text} from 'react-native'
import {Link} from 'expo-router';
import { Colors } from '../../constants/Colors';

import ThemedView from '../../components/ThemedView';
import ThemedText from '../../components/ThemedText';
import Spacer from '../../components/Spacer';
import ThemedButton from '../../components/ThemedButton';




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

    <TextInput placeholder="Email"/> 

    <ThemedButton onPress={handleSubmit}>
        <Text style ={{color: '#f2f2f2'}}>Login</Text>
        </ThemedButton>  

   </ThemedView>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
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