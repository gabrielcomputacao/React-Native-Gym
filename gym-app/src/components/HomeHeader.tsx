import { HStack, Heading, Text, VStack, Icon } from "native-base";
import { UserPhoto } from "./UserPhoto";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";

import defaultPhotoAvatar from "@assets/userPhotoDefault.png";

export function HomeHeader() {
  const { user } = useAuth();

  return (
    /* Hstack - horizontal , VStack vertical  */
    <HStack
      backgroundColor="gray.500"
      pt={16}
      pb={5}
      px={8}
      alignItems="center"
    >
      <UserPhoto
        size={16}
        source={user.avatar ? { uri: user.avatar } : defaultPhotoAvatar}
        alt="Imagem do Usuário"
      />
      <VStack flex={1} ml={4}>
        <Text color="gray.100" fontSize="md">
          Olá
        </Text>

        <Heading color="gray.100" fontFamily="heading" fontSize="md">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  );
}
