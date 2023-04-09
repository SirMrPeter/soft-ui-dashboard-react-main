/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Distance Learning React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";

// Distance Learning React examples
import DataTable from "examples/Tables/DataTable";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import SoftAvatar from "components/SoftAvatar";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import SoftTypography from "components/SoftTypography";
import { useNavigate } from "react-router-dom";

// Set up the fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Data

function OrderList({ courseId }) {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [imageUrls, setImageUrls] = useState([]);

  const { auth } = useAuth();

  const [users, setUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);
  const [csvList, setCsvList] = useState();

  const docDefinition = {
    content: [
      { text: "Users List", style: "header" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*"],
          body: [
            ["Name", "Surname"],
            ...users.map((user) => [user.name, user.surname]),
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosPrivate.get(`courses/${courseId}/members`, {
          headers: { "Content-Type": "application/json", Accept: "aplication/json" },
        });
        setUsers(data);
        const processedData = data.map((user) => ({
          name: user.name,
          surname: user.surname,
        }));
        Promise.all(
          data.map((user) =>
            axiosPrivate
              .get(`/profile-picture/users/${user._id}/picture`, {
                responseType: "blob",
              })
              .then((response) => URL.createObjectURL(response.data))
              .catch((error) => {
                console.error("Error fetching image:", error);
                return null;
              })
          )
        ).then(setImageUrls);
        setCsvList(processedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length === imageUrls.length) {
      try {
        const tableData = users.map((user, index) => ({
          id: user._id,
          name: user.name,
          surname: user.surname,
          picture: imageUrls[index],
        }));
        setListUsers(tableData);
      } catch (error) {
        console.error(error);
      }
    }
  }, [imageUrls]);

  const handlePdfExport = () => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download("users.pdf");
  };

  function exportCSV(tableData) {
    const separator = ",";
    const keys = Object.keys(tableData[0]);
    const csvContent = `${keys.join(separator)}\n${tableData
      .map((row) =>
        keys
          .map((key) => {
            let cellData = row[key];
            cellData = cellData === null || cellData === undefined ? "" : cellData.toString();
            cellData = cellData.includes(separator) ? `"${cellData}"` : cellData;
            return cellData;
          })
          .join(separator)
      )
      .join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table-data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <SoftBox>
      {listUsers && listUsers.length > 0 ? (
        <SoftBox my={3}>
          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <SoftBox display="flex">
              <SoftBox ml={1}>
                <SoftButton variant="outlined" color="dark" onClick={() => exportCSV(csvList)}>
                  <Icon>description</Icon>
                  &nbsp;export csv
                </SoftButton>
              </SoftBox>
              <SoftBox ml={1}>
                <SoftButton variant="outlined" color="dark" onClick={handlePdfExport}>
                  <Icon>picture_as_pdf</Icon>
                  &nbsp;Export PDF
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          <SoftBox>
            {users.length > 0 && (
              <SoftBox>
                <Card>
                  <SoftBox pt={2} px={2} lineHeight={1}>
                    <SoftTypography variant="h6" fontWeight="medium">
                      Members
                    </SoftTypography>
                  </SoftBox>
                  <DataTable
                    table={{
                      columns: [
                        {
                          Header: "picture",
                          accessor: "picture",
                          width: "10%",
                          Cell: ({ row }) => <SoftAvatar src={row.original.picture} size="sm" />,
                        },
                        { Header: "name", accessor: "name" },
                        { Header: "surname", accessor: "surname" },
                        {
                          Header: "actions",
                          accessor: "actions",
                          Cell: ({ row }) => (
                            <SoftButton
                              onClick={() => navigate("/profile/messages")}
                            >
                              Message
                            </SoftButton>
                          ),
                        },
                      ],
                      rows: listUsers,
                    }}
                    entriesPerPage={false}
                    canSearch
                  />
                </Card>
              </SoftBox>
            )}
          </SoftBox>
        </SoftBox>
      ) : (
        <SoftBox>Still loading</SoftBox>
      )}
    </SoftBox>
  );
}

OrderList.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default OrderList;
