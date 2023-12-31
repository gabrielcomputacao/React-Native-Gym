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
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

import defaultPhotoAvatar from "@assets/userPhotoDefault.png";

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null;
  confirm_password?: string | null;
  old_password?: string;
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
  old_password: yup.string(),
});

export function Profile() {
  const { user, updatedUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

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
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await updatedUserProfile(userUpdated);

      await api.put("/users", {
        name: data.name,
        password: data.password,
        old_password: data.old_password,
      });

      toast.show({
        title: "Atualizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os detales do exercicio";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdating(false);
    }
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

        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        /* o append adiciona esses requisitos ao formulario, e o nome do campo tem que ser igual do backend e o segundo parametro sao os
          dados que serão salvos
        */
        userPhotoUploadForm.append("avatar", photoFile);

        const avatarUpdatedResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;
        updatedUserProfile(userUpdated);

        toast.show({
          title: "Foto Atualizada!",
          placement: "top",
          color: "red.500",
        });
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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : defaultPhotoAvatar
              }
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
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
