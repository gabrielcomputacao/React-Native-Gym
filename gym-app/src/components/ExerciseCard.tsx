import { HStack, Heading, Image, Text, VStack, Icon } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons";

type ExerciseCardProps = TouchableOpacityProps & {};

export function ExerciseCard({ ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        p={2}
        alignItems="center"
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: "https://blog.lionfitness.com.br/wp-content/uploads/2019/01/Blog-75-1.jpg",
          }}
          alt="Pessoa fazendo exercicio"
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="cover"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white">
            Remada Baixa
          </Heading>
          <Text fontSize="sm" color="gray.200" numberOfLines={2} mt={1}>
            3 Séries x 12 repetições
          </Text>
        </VStack>
        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  );
}
