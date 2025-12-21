import MrBertStackNav from './WiseMrBertRoutineGuide/SharpDailyGuidanceNavigation/MrBertStackNav';
import MrBertLoader from './WiseMrBertRoutineGuide/SharpDailyGuidanceComponents/MrBertLoader';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ContextProvider } from './WiseMrBertRoutineGuide/SharpDailyGuidanceStorage/mrBertContext';

const App = () => {
  const [isVisibleStack, setIsVisibleStack] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsVisibleStack(true);
    }, 5000);
  }, []);

  return (
    <NavigationContainer>
      <ContextProvider>
        {isVisibleStack ? <MrBertStackNav /> : <MrBertLoader />}
      </ContextProvider>
    </NavigationContainer>
  );
};

export default App;
