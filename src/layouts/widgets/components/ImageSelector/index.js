/* eslint-disable react/no-array-index-key */
import { ImageList, ImageListItem } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import React, { useState } from "react";
import availableImages from "./availableImages";

function CourseImageSelector() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  return (
    <SoftBox>
      <SoftTypography varinat="h2">Select Course Image</SoftTypography>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {availableImages.map((item) => (
          <ImageListItem key={item}>
            <img
              src={item}
              srcSet={item}
              loading="lazy"
              alt="imagePick"
              ocClick={handleImageClick}
            />
          </ImageListItem>
        ))}
      </ImageList>
      {selectedImage && <p>You have selected {selectedImage} as the course image.</p>}
    </SoftBox>
  );
}

export default CourseImageSelector;
