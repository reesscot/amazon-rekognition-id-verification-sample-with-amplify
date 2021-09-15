import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import { Amplify, Auth, withSSRContext } from "aws-amplify";
import React, { MouseEvent, useState, SetStateAction, Dispatch, useEffect } from "react";
import Head from "next/head";
import awsExports from "../src/aws-exports";
import { GetServerSideProps } from 'next'
import Link from "next/link"
import Sidebar from "../components/sidebar"
import PageHeading from "../components/pageheadingcomponent";
import DashboardComponent from "../components/dashboard";
import UserDetails from "../components/user-details";
import UploadImages from "../components/upload-images"
import BrowseImages from "../components/browse-images";
import Collections from "../components/collections";
import RegisterNewUser from "../components/register-new-user";
import LoginUser from "../components/login-user";
import BrowseUsers from "../components/browse-users";
import DefaultLayout from "../components/Layout/DefaultLayout";

Amplify.configure({ ...awsExports, ssr: true });

interface MyProps {
  username: string
}

interface DashboardState {
  currentMenuItem: string,
  username: string
}

function handleLinkClick(linkName: string, state: DashboardState, setState: Dispatch<SetStateAction<DashboardState>>) {
  setState({ currentMenuItem: linkName, username: state.username });
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const SSR = withSSRContext(context);

  var myProps: MyProps = { username: '' };

  try {
    const user = await SSR.Auth.currentAuthenticatedUser();
    if (user && user.username) {
      myProps.username = user.username;
    }
  } catch (error) {
    console.log(error);
  }

  return {
    props: myProps
  };
}

function GetMainContent(myState: DashboardState) {

  const dashProps = { pageHeading: myState.currentMenuItem, username: myState.username }

  switch (myState.currentMenuItem) {
    case "User details":
      return <UserDetails {...dashProps} />;
    case "Upload images":
      return <UploadImages {...dashProps} />;
    case "Browse images":
      return <BrowseImages {...dashProps} />;
    case "Collections":
      return <Collections {...dashProps} />;
    case "Register new user":
      return <RegisterNewUser {...dashProps} />;
    case "Login user":
      return <LoginUser {...dashProps} />;
    case "Browse users":
      return <BrowseUsers {...dashProps} />;
    default:
      return <DashboardComponent />;
  }
}

export default function Index(props: MyProps) {

  const [dashProps, setDashProps] = useState({ currentMenuItem: 'Dashboard', username: props.username });

  const layoutProps = {username: dashProps.username, title: 'Dashboard', children: DashboardComponent()};

  return (
    <DefaultLayout {...layoutProps} />
  )
}