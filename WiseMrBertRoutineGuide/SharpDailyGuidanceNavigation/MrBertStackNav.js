import { createStackNavigator } from '@react-navigation/stack';
import MrBertIntro from '../SharpDailyGuidanceScreens/MrBertIntro';
import MrBertBottomTabs from './MrBertBottomTabs';

const Stack = createStackNavigator();

const MrBertStackNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MrBertIntr" component={MrBertIntro} />
      <Stack.Screen name="MrBertBottomTabs" component={MrBertBottomTabs} />
    </Stack.Navigator>
  );
};

export default MrBertStackNav;
