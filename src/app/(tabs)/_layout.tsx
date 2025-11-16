import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import Gerador from "./gerador";
import Home from "./home";
import Settings from "./settings";

const HomeRoute = () => <Home />;
const GeradorRoute = () => <Gerador />;
const SettingsRoute = () => <Settings />;

const MyComponent = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "gerador",
      title: "Gerador",
      focusedIcon: "plus-circle",
      unfocusedIcon: "plus-circle-outline",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    gerador: GeradorRoute,
    settings: SettingsRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;
