import { HStack, Heading, Text, VStack } from "native-base";

export function HistoryCard() {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack>
        <Heading color="white" fontSize="md" textTransform="capitalize">
          Costas
        </Heading>

        <Text color="gray.100" numberOfLines={1} fontSize="lg">
          Remada Baixa
        </Text>
      </VStack>

      <Text color="gray.300" fontSize="md">
        8:56
      </Text>
    </HStack>
  );
}
