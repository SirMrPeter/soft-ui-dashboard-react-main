/* eslint-disable react/prop-types */
/**
=========================================================
* Distance Learning React - v1.1.0
=========================================================

Coded by Ambro-Dev

*/

// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Distance Learning React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftButton from "components/SoftButton";

// Wizard application components
import FormField from "layouts/wizard/components/FormField";
import { useState } from "react";
import NewEvent from "../NewCourse";

// Images

const REACT_APP_SERVER_URL = "http://localhost:5500";

function About({ setDescription, setName, name, description, setPic }) {
  const serverUrl = REACT_APP_SERVER_URL;
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const savePicture = (avatar) => {
    setPic(avatar);
    setSelectedAvatar(avatar);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <SoftBox sx={{ my: 4 }}>
      <SoftBox width="82%" textAlign="center" mx="auto" my={4}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="regular">
            Add course name and description
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="body2" color="text">
          Change image if You like
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} container justifyContent="center">
            <SoftBox position="relative" height="max-content" mx="auto">
              <SoftAvatar
                src={
                  selectedAvatar
                    ? `${serverUrl}/${selectedAvatar}`
                    : `${serverUrl}/storage/courses/course_images/course_image_11.gif`
                }
                alt="profile picture"
                size="xxl"
                variant="rounded"
              />
              <SoftBox alt="spotify logo" position="absolute" right={0} bottom={0} mr={-1} mb={-1}>
                <Tooltip title="Edit" placement="top">
                  <SoftButton
                    variant="gradient"
                    color="info"
                    size="small"
                    iconOnly
                    onClick={openModal}
                  >
                    <Icon>edit</Icon>
                  </SoftButton>
                </Tooltip>
                <NewEvent open={isModalOpen} onClose={closeModal} setSelectedAvatar={savePicture} />
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} sm={12}>
            <SoftBox mb={2}>
              <FormField
                type="text"
                label="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </SoftBox>
            <SoftBox mb={2}>
              <FormField
                type="text"
                label="Description"
                multiline
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

export default About;
