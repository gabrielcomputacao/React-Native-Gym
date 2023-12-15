import { HStack, Heading, Text, VStack } from "native-base";
import { UserPhoto } from "./UserPhoto";

export function HomeHeader() {
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
        source={{ uri: "https://github.com/gabrielcomputacao.png" }}
        alt="Imagem do Usuário"
        mr={4}
      />
      <VStack>
        <Text color="gray.100" fontSize="md">
          Olá
        </Text>

        <Heading>Gabriel</Heading>
      </VStack>
    </HStack>
  );
}
