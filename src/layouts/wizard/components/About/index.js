/* eslint-disable react/prop-types */
/**
=========================================================
* Distance Learning React - v1.1.0
=========================================================

Coded by Ambro-Dev

*/

// @mui material components
import Grid from "@mui/material/Grid";

// Distance Learning React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Wizard application components
import FormField from "../FormField";

function About({ setDescription, setName, name, description }) {
  return (
    <SoftBox>
      <SoftBox width="82%" textAlign="center" mx="auto" my={4}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5" fontWeight="regular">
            Let&apos;s start with the basic information
          </SoftTypography>
        </SoftBox>
        <SoftTypography variant="body2" color="text">
          Add course name and description
        </SoftTypography>
      </SoftBox>
      <SoftBox mt={2}>
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
      </SoftBox>
    </SoftBox>
  );
}

export default About;
