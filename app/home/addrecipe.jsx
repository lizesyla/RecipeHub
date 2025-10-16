import { useState } from "react"
import { Text, TextInput, TouchableOpacity} from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"


export default function AddRecipe() {
  const [recipe, setRecipe] = useState("");
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Add a New Recipe</Text>

      <TextInput
        placeholder="Enter recipe name..."
        value={recipe}
        onChangeText={setRecipe}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          backgroundColor: "#FF7F50",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
