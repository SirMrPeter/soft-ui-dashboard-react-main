/* eslint-disable no-underscore-dangle */
// Distance Learning React components
import SoftBox from "components/SoftBox";

// Distance Learning React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import { Card, Grid, Toolbar } from "@mui/material";

import { useContext, useEffect, useRef, useState } from "react";

import useAxiosPrivate from "hooks/useAxiosPrivate";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { SocketContext } from "context/socket";

import useAuth from "hooks/useAuth";
import SoftButton from "components/SoftButton";
import { navbarContainer } from "examples/Navbars/DashboardNavbar/styles";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import "./styles/styles.css";
import Lottie from "lottie-react-web";
import conversationAnimation from "assets/images/illustrations/981-consultation-flat-edited.json";
import messageAnimation from "assets/images/illustrations/177-envelope-mail-send-flat-edited.json";
import Header from "../Header";

// Connect to the Socket.io server

// Data

function Messages() {
  const { socket } = useContext(SocketContext);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [query, setQuery] = useState();
  const [usersList, setUsersList] = useState([]);
  const [conversationsList, setConversationsList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messagesList, setMessagesList] = useState({});
  const [messageText, setMessageText] = useState("");
  const messagesContainerRef = useRef();
  const sendRef = useRef();

  useEffect(() => {
    // Fetch the list of conversations from the server
    axiosPrivate
      .get(`/conversations/${auth.userId}`)
      .then((response) => {
        setConversationsList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch the list of users from the server
    axiosPrivate
      .get("/users")
      .then((response) => {
        setUsersList(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

    // Listen for new messages

    socket.on("conversation-messages", (messages) => {
      setMessagesList(messages);
    });

    socket.on("message", (message) => {
      setMessagesList((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messagesList]);

  const handleConversationSelect = (conversationId) => {
    if (selectedConversation) {
      socket.emit("leave-conversation", { conversation: selectedConversation });
    }

    setSelectedConversation(conversationId);
    setMessagesList([]);
    socket.emit("join-conversation", conversationId);
    setTimeout(() => {
      sendRef.current.scrollIntoView({ behavior: "auto" });
    }, 300);
  };

  const handleUserClick = (chatUser) => {
    const selectedUser = usersList.find((user) => user._id === chatUser);
    if (selectedUser) {
      const newConversation = {
        name: `${selectedUser.name} ${selectedUser.surname} - ${auth.name} ${auth.surname}`,
        members: [auth.userId, selectedUser._id],
      };
      axiosPrivate
        .post("/conversations/", newConversation)
        .then((response) => {
          setConversationsList((prevConversations) => [...prevConversations, response.data]);
          setSelectedConversation(response.data._id);
          setMessagesList([]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!selectedConversation) {
      return;
    }
    if (messageText.trim() === "") {
      return;
    }
    const newMessage = {
      sender: auth.userId,
      text: messageText,
      conversation: selectedConversation,
    };
    try {
      await socket.emit("send-message", newMessage);
      setMessageText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <Header stage={1} />
      <SoftBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={4}>
            <SoftBox mb={3}>
              <Toolbar sx={(theme) => navbarContainer(theme)}>
                <SoftBox pr={1}>
                  <Autocomplete
                    disablePortal
                    options={usersList}
                    getOptionLabel={(user) => `${user.name} ${user.surname} ${user.studentNumber}`}
                    onChange={(event, value) => setQuery(value ? value._id : "")}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Search users..." />}
                  />
                </SoftBox>
              </Toolbar>
              <SoftBox pl={3}>
                <SoftButton onClick={() => handleUserClick(query)}>Create new conversation</SoftButton>
              </SoftBox>
            </SoftBox>
            <SoftBox mb={3}>
              <SoftTypography pb={1} variant="h5">
                Conversations:
              </SoftTypography>
              {conversationsList.map((conversation) => (
                <SoftBox key={conversation._id} pt={1}>
                  <SoftButton
                    size="large"
                    role="button"
                    onClick={() => handleConversationSelect(conversation._id)}
                    onKeyDown={() => handleConversationSelect(conversation._id)}
                    fullWidth
                  >
                    {conversation.name}
                  </SoftButton>
                </SoftBox>
              ))}
            </SoftBox>
          </Grid>
          <Grid item xs={12} xl={8} sx={{ height: "max-content" }}>
            <Card className="chat-conversation">
              <SoftBox m={3}>
                {selectedConversation ? (
                  <>
                    <SoftBox className="chat-header">
                      <SoftTypography variant="h5">
                        {conversationsList.find((conv) => conv._id === selectedConversation)?.name}
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox
                      ref={messagesContainerRef}
                      className="messages-container"
                      display="flex"
                      flexDirection="column"
                      mt={2}
                    >
                      {messagesList && Object.values(messagesList).length > 0 ? (
                        Object.values(messagesList).map((message) => {
                          const sender = usersList.find((user) => user._id === message.sender);
                          const formattedDate = new Date(message.createdAt).toLocaleDateString(
                            "us-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          );
                          const formattedTime = new Date(message.createdAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: false,
                            }
                          );
                          return (
                            <Card
                              className={`chat-message ${
                                message.sender === auth.userId ? "self" : "other"
                              }`}
                              key={message._id}
                            >
                              <SoftTypography
                                className="sender"
                                fontWeight="medium"
                                variant="caption"
                              >{`${sender.name} ${sender.surname}`}</SoftTypography>
                              <SoftTypography className="text" variant="button" color="text">
                                {message.text}
                              </SoftTypography>
                              <SoftTypography
                                className="date"
                                variant="caption"
                                pt={2}
                                sx={({ justifyContent: "flex-end" }, { alignSelf: "flex-end" })}
                              >
                                {`${formattedDate} ${formattedTime}`}
                              </SoftTypography>
                            </Card>
                          );
                        })
                      ) : (
                        <Grid container spacing={2} display="flex" alignItems="center">
                          <Grid
                            item
                            xs={12}
                            xl={6}
                            alignItems="flex-center"
                            justifyContent="center"
                            display="flex"
                          >
                            <SoftTypography
                              variant="h5"
                              fontWeight="medium"
                              textTransform="uppercase"
                            >
                              No messages yet
                            </SoftTypography>
                          </Grid>
                          <Grid item xs={12} xl={6} sx={{ height: "300px" }}>
                            <Lottie
                              options={{
                                animationData: messageAnimation,
                                loop: true,
                                autoplay: true,
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </SoftBox>
                    <SoftBox
                      display="flex"
                      component="form"
                      role="form"
                      onSubmit={handleSendMessage}
                      justifyContent="flex-end"
                      mt={2}
                    >
                      <SoftInput
                        type="text"
                        placeholder="Type a message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        fullWidth
                      />
                      <SoftButton type="submit">Send</SoftButton>
                    </SoftBox>
                  </>
                ) : (
                  <Grid container spacing={2} display="flex" alignItems="center">
                    <Grid
                      item
                      xs={12}
                      xl={6}
                      alignItems="flex-center"
                      justifyContent="center"
                      display="flex"
                    >
                      <SoftTypography variant="h5" fontWeight="medium" textTransform="uppercase">
                        Select conversation or search user and create a new one
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={12} xl={6} sx={{ height: "400px" }}>
                      <Lottie
                        options={{
                          animationData: conversationAnimation,
                          loop: true,
                          autoplay: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </SoftBox>
            </Card>
            <SoftBox ref={sendRef} />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Messages;
