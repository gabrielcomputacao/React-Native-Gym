import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
} from "native-base";

import BackgroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import axios from "axios";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordconfirm: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o email").email("E-mail inválido."),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 digitos."),
  passwordconfirm: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password")], "A senha não confere."),
});

export function SignUp() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
  });

  function handleGoBack() {
    navigation.goBack();
  }

  function handleSignUp({ name, email, password }: FormDataProps) {
    /* ip usando wifi 192.168.2.110 */
    /* ip usando rede 192.168.2.107 */
    /*  fetch("http://192.168.2.110:3333/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err)); */

    setIsLoading(true);

    api
      .post("/users", { name, email, password })
      .then((response) => {
        signIn(email, password);
      })
      .catch((error) => {
        setIsLoading(false);

        const isAppError = error instanceof AppError;

        const title = isAppError ? error.message : "Não foi possível cadastrar";

        toast.show({
          title,
          bgColor: "red.500",
          placement: "top",
        });
      });
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.700" px={10}>
        {/* melhor trabalhar com a image do native base ao inves do background image */}
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          /* tudo irá ficar em cima da imagem passando essa position */
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors?.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors?.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors?.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordconfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirmar Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors?.passwordconfirm?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          title="Voltar para o login"
          variant="outline"
          mt={24}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  );
}
