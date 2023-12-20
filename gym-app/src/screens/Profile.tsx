import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@hooks/useAuth";

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null;
  confirm_password?: string | null;
  old_password: string;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o email"),
  password: yup
    .string()
    .min(6, "A seha deve ter 6 dígitos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    /* o nullable e o transforme prefire o comportamento da pessoa começar a digitar depois para sendo assim o transforme volte o campo para
      o estado null, e nao para string vazia que era o default
    */
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), "A confirmação de senha não confere"])
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação da senha.")
          .transform((value) => (!!value ? value : null)),
    }),
  old_password: yup.string().required("Informe o nome"),
});

export function Profile() {
  const { user } = useAuth();
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/gabrielcomputacao.png"
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  const toast = useToast();

  async function handleProfileUpdate(data: FormDataProps) {
    console.log(data);
  }

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);

    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.exists && photoInfo?.size / 1024 / 1024 > 4) {
          return toast.show({
            title: "Essa imagem é muito grande 3MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton w={PHOTO_SIZE} h={PHOTO_SIZE} rounded="full" />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              alt="Imagem do usuario"
              size={PHOTO_SIZE}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
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

          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                bg="gray.600"
                value={value}
                isDisabled
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
        </Center>

        <VStack px={10} mb={9} mt={12}>
          <Heading color="gray.200" fontSize="md" mb={2} fontFamily="heading">
            Alterar Senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Senha Antiga"
                bg="gray.600"
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Senha Nova"
                bg="gray.600"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Confirme a Nova Senha"
                bg="gray.600"
                onChangeText={onChange}
                errorMessage={errors.confirm_password?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
