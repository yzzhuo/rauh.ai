import { Box, Card, Flex, Text } from '@radix-ui/themes';

export default function ChatMessage({ message, isUser }: {
  message: string;
  isUser: boolean;
}) {
  return (
    <Box maxWidth="240px">
      <Card>
        <Flex gap="3" align="center">
          <Box>
            <Text as="div" size="2" weight="bold">
              {isUser ? 'You' : 'Assistant'}
            </Text>
            <Text as="div" size="2" color="gray">
              {message}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>
  )
}