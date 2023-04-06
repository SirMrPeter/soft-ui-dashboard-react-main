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
import SoftButton from "components/SoftButton";
import SoftAvatar from "components/SoftAvatar";
import SoftBadge from "components/SoftBadge";
import PropTypes from "prop-types";

// Images
import { useEffect, useState } from "react";
import useAxiosPrivate from "hooks/useAxiosPrivate";

const REACT_APP_SERVER_URL = "http://localhost:5500";

function CourseEdit({ courseId, setEditing, handleSave, editing }) {
  const [course, setCourse] = useState();
  const axiosPrivate = useAxiosPrivate();
  const serverUrl = REACT_APP_SERVER_URL;
  const [pictureUrl, setPictureUrl] = useState();

  useEffect(() => {
    axiosPrivate.get(`/courses/${courseId}`).then((response) => {
      setCourse(response.data);
      setPictureUrl(`${serverUrl}/${response.data.pic}`);
    });
  }, []);

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} md={6}>
        <SoftBox display="flex" alignItems="center">
          <SoftBox mr={2}>
            <SoftAvatar size="xxl" src={pictureUrl} alt="course image" />
          </SoftBox>
          <SoftBox lineHeight={1}>
            <SoftTypography variant="h6" fontWeight="medium">
              {course?.name}
            </SoftTypography>
            <SoftBadge variant="gradient" color="info" size="xs" badgeContent="course" container />
          </SoftBox>
        </SoftBox>
      </Grid>
      <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
        {editing ? (
          <SoftButton color="success" onClick={handleSave}>
            Save
          </SoftButton>
        ) : (
          <SoftButton onClick={setEditing}>Edit Course</SoftButton>
        )}
      </Grid>
    </Grid>
  );
}

CourseEdit.propTypes = {
  courseId: PropTypes.string.isRequired,
  setEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default CourseEdit;
