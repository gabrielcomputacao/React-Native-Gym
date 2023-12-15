import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(true);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded="full" />
          ) : (
            <UserPhoto
              source={{ uri: "https://github.com/gabrielcomputacao.png" }}
              alt="Imagem do usuario"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mb={8}
              mt={2}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Input placeholder="Nome" bg="gray.600" />
          <Input placeholder="E-mail" bg="gray.600" isDisabled />
        </Center>

        <VStack px={10} mb={9} mt={12}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar Senha
          </Heading>
          <Input bg="gray.600" secureTextEntry placeholder="Senha Antiga" />
          <Input bg="gray.600" secureTextEntry placeholder="Senha Nova" />
          <Input
            bg="gray.600"
            secureTextEntry
            placeholder="Confirme a Nova Senha"
          />

          <Button title="Atualizar" mt={4} />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
