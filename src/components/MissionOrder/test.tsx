import React, { useState } from "react";

const ImageToBase64: React.FC = () => {
  const [base64String, setBase64String] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a FileReader

      reader.onload = () => {
        const result = reader.result as string; // Ensure result is a string
        const base64 = result.split(",")[1]; // Extract Base64 string (without data URL prefix)
        setBase64String(base64); // Update state
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      alert("No file selected!");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image to Base64 Converter</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {base64String && (
        <div>
          <h3>Base64 Output:</h3>
          <textarea
            style={{ width: "100%", height: "200px" }}
            value={base64String}
            readOnly
          />
        </div>
      )}
    </div>
  );
};

export default ImageToBase64;
