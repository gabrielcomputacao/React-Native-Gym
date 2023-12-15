import { Text, Pressable, IPressableProps } from "native-base";

type GroupProps = IPressableProps & {
  name: string;
  isActive: boolean;
};

/* Pressable é um componente do nativa base que deixa uma area clicavel, a diferença com o touchableOpacity é que ele nao faz o efeito de opacidade */

export function Group({ name, isActive, ...rest }: GroupProps) {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg="gray.600"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: "green.500",
        borderWidth: 1,
      }}
      {...rest}
    >
      <Text
        color={isActive ? "green.500" : "gray.200"}
        textTransform="uppercase"
        fontSize="xs"
        fontWeight="bold"
      >
        {name}
      </Text>
    </Pressable>
  );
}
