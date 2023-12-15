import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack, SectionList, Text } from "native-base";
import { useState } from "react";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "15.08.23",
      data: ["costas"],
    },
    {
      title: "16.08.23",
      data: ["Puxada Frontal"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios"></ScreenHeader>

      {/* consegue renderizar o componente e consegue dividir por meio de um componente que vai ser um header para formatação de um grupo,
    o sectionList faz a separação por meio de grupos coisa que o flat list nao faz automatico  */}

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        /* renderiza o titulo e separa pelo que foi colocado no state */
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            {/* quebra de linha no react */}
            Não há exercícios registrados ainda. {"\n"}
            Vamos exercitar hoje?
          </Text>
        )}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
