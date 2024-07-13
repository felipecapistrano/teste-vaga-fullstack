import { Box, Button, Input, Text, useTheme } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import axios from "axios";
import { saveAs } from "file-saver";
import { useState } from "react";

type initialValues = {
  csvFile: File | undefined;
};

function App() {
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleSubmit = async (values: initialValues) => {
    try {
      setLoading(true);
      if (values.csvFile) {
        const formData = new FormData();
        formData.append("file", values.csvFile);

        const response = await axios.post(
          "http://localhost:3001/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "text/csv" });
        saveAs(blob, "processed.csv");
      }
    } catch (error) {
      console.error("Error uploading file:", { error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      backgroundImage={`url(https://i.ebayimg.com/images/g/n8IAAOSwltRkNCSF/s-l1600.png)`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Box
        backgroundColor={colors.white}
        width="25%"
        p={4}
        position="absolute"
        right="50%"
        top="50%"
        rounded="lg"
        transform="translateY(-50%) translateX(50%)"
        display="flex"
        flexDirection="column"
      >
        <Formik
          initialValues={{ csvFile: undefined, fileName: "" }}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form encType="multipart/form-data">
              <Text as="b">Please upload your CSV</Text>
              <Input
                mt={4}
                type="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const file = event.currentTarget.files?.[0];
                  setFieldValue("csvFile", file);
                }}
              />

              <Button
                mt={4}
                w="100%"
                colorScheme="teal"
                type="submit"
                isLoading={loading}
              >
                Upload CSV
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default App;
