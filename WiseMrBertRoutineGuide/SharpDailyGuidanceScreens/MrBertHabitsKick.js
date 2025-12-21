import React, { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MrBertLayout from '../SharpDailyGuidanceComponents/MrBertLayout';
import MrBertHeader from '../SharpDailyGuidanceComponents/MrBertHeader';
import { useFocusEffect } from '@react-navigation/native';
import { mrBertHabitsKick } from '../SharpDailyGuidanceData/mrBertHabitsKick';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from 'react-native';

const { height } = Dimensions.get('window');

const MrBertHabitsKick = () => {
  const [mrBertTask, setMrBertTask] = useState(null);
  const [mrBertMode, setMrBertMode] = useState('ready');
  const [mrBertTimer, setMrBertTimer] = useState(300);
  const mrBertIntervalRef = useRef(null);
  const [mrBertRemain, setMrBertRemain] = useState('24:00');

  useEffect(() => {
    const mrBertUpdateRemain = async () => {
      const savedRemainingText = await mrBertGetRemainingTimeText();
      setMrBertRemain(savedRemainingText);
    };

    mrBertUpdateRemain();
    const mrBertTimerInterval = setInterval(mrBertUpdateRemain, 60000);

    return () => clearInterval(mrBertTimerInterval);
  }, [mrBertMode]);

  useFocusEffect(
    useCallback(() => {
      mrBertInitTask();
    }, []),
  );

  const mrBertInitTask = async () => {
    const lastMrBertDoneTask = await AsyncStorage.getItem(
      'mrbert_habits_last_done',
    );
    if (lastMrBertDoneTask) {
      const lastSavedTime = Number(lastMrBertDoneTask);
      const dateNow = Date.now();
      const mrBertDiff = dateNow - lastSavedTime;

      if (mrBertDiff < 86400000) {
        setMrBertMode('done');
        return;
      }
    }

    const savedMrBertTask = await AsyncStorage.getItem('mrbert_habits_task');

    if (savedMrBertTask) {
      setMrBertTask(JSON.parse(savedMrBertTask));
    } else {
      const shuffMrBertTasks = [...mrBertHabitsKick].sort(
        () => Math.random() - 0.5,
      );
      const isFirstTask = shuffMrBertTasks[0];
      setMrBertTask(isFirstTask);
      await AsyncStorage.setItem(
        'mrbert_habits_task',
        JSON.stringify(isFirstTask),
      );
    }
  };

  const mrBertStartTask = () => {
    setMrBertMode('running');
    setMrBertTimer(300);

    mrBertIntervalRef.current = setInterval(() => {
      setMrBertTimer(prevMrBertState => {
        if (prevMrBertState <= 1) {
          clearInterval(mrBertIntervalRef.current);
          return 0;
        }
        return prevMrBertState - 1;
      });
    }, 1000);
  };

  const mrBertRestartTimer = () => {
    setMrBertTimer(300);
  };

  const mrBertFinishTask = async () => {
    clearInterval(mrBertIntervalRef.current);
    const dateNow = Date.now();
    await AsyncStorage.setItem('mrbert_habits_last_done', dateNow.toString());
    setMrBertMode('done');
  };

  const mrBertShareTask = () => {
    if (!mrBertTask) return;
    Share.share({
      message: `${mrBertTask.title}\n${mrBertTask.subtitle}`,
    });
  };

  const mrBertGetRemainingTimeText = async () => {
    const lastMrBertDoneTask = await AsyncStorage.getItem(
      'mrbert_habits_last_done',
    );
    if (!lastMrBertDoneTask) return '24:00';

    const lastMrBertDoneTime = Number(lastMrBertDoneTask);
    const dateNow = Date.now();
    const mrBertDiff = 86400000 - (dateNow - lastMrBertDoneTime);

    if (mrBertDiff <= 0) return '00:00';

    const mrBertHours = Math.floor(mrBertDiff / (1000 * 60 * 60));
    const mrBertMinutes = Math.floor(
      (mrBertDiff % (1000 * 60 * 60)) / (1000 * 60),
    );

    return `${mrBertHours.toString().padStart(2, '0')}:${mrBertMinutes
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <MrBertLayout>
      <View style={mrBertStyles.mrBertWrap}>
        <MrBertHeader headerTitle="Habits Kick:" />

        <Image
          source={require('../../assets/mrBertAppImages/mrbertbokkmarkscr.png')}
          style={{ top: 40 }}
        />

        {mrBertMode === 'done' && (
          <View style={mrBertStyles.mrBertBox}>
            <View style={mrBertStyles.mrBertBoxInner}>
              <Text style={mrBertStyles.mrBertTitle}>Good Job!</Text>
              <Text style={mrBertStyles.mrBertSmallText}>
                Bring back tomorrow!
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  gap: 8,
                }}
              >
                <Image
                  source={require('../../assets/mrBertAppImages/mrberttimer.png')}
                />
                <Text style={mrBertStyles.mrBertClockText}>{mrBertRemain}</Text>
              </View>
            </View>
          </View>
        )}

        {mrBertMode === 'ready' && mrBertTask && (
          <>
            <View style={mrBertStyles.mrBertBox}>
              <View style={mrBertStyles.mrBertBoxInner}>
                <Text style={mrBertStyles.mrBertTitle}>{mrBertTask.title}</Text>
                <Text style={mrBertStyles.mrBertSubtitle}>
                  {mrBertTask.subtitle}
                </Text>
              </View>
            </View>

            <View style={mrBertStyles.mrBertRow}>
              <TouchableOpacity
                style={mrBertStyles.mrBertIconBtn}
                onPress={mrBertRestartTimer}
              >
                <Image
                  source={require('../../assets/mrBertAppImages/mrbertrefresh.png')}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={mrBertStyles.mrBertMainBtn}
                onPress={mrBertStartTask}
              >
                <Text style={mrBertStyles.mrBertMainBtnText}>Start Task</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={mrBertStyles.mrBertIconBtn}
                onPress={mrBertShareTask}
              >
                <Image
                  source={require('../../assets/mrBertAppImages/mrbertshare.png')}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}

        {mrBertMode === 'running' && mrBertTask && (
          <>
            <View style={mrBertStyles.mrBertBox}>
              <View style={mrBertStyles.mrBertBoxInner}>
                <Text style={mrBertStyles.mrBertTitle}>{mrBertTask.title}</Text>
                <Text style={mrBertStyles.mrBertSubtitle}>
                  {mrBertTask.subtitle}
                </Text>
              </View>
            </View>

            <View style={mrBertStyles.mrBertRow}>
              <TouchableOpacity
                style={mrBertStyles.mrBertIconBtn}
                onPress={mrBertRestartTimer}
              >
                <Image
                  source={require('../../assets/mrBertAppImages/mrbertrefresh.png')}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  mrBertStyles.mrBertMainBtn,
                  mrBertTimer === 0 && { backgroundColor: '#FB8609' },
                ]}
                onPress={mrBertTimer === 0 ? mrBertFinishTask : null}
              >
                <Text style={mrBertStyles.mrBertMainBtnText}>
                  {mrBertTimer === 0
                    ? 'Finish'
                    : `${Math.floor(mrBertTimer / 60)}:${(mrBertTimer % 60)
                        .toString()
                        .padStart(2, '0')}`}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={mrBertStyles.mrBertIconBtn}
                onPress={mrBertShareTask}
              >
                <Image
                  source={require('../../assets/mrBertAppImages/mrbertshare.png')}
                  style={{ width: 26, height: 26 }}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </MrBertLayout>
  );
};

const mrBertStyles = StyleSheet.create({
  mrBertWrap: {
    flex: 1,
    alignItems: 'center',
    padding: 28,
    paddingTop: height * 0.07,
    paddingBottom: 130,
  },
  mrBertBox: {
    padding: 10,
    backgroundColor: '#203453',
    borderRadius: 22,
    width: '100%',
    marginTop: 10,
  },
  mrBertBoxInner: {
    padding: 20,
    borderRadius: 22,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#7696CA',
    alignItems: 'center',
    gap: 10,
  },
  mrBertTitle: {
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    fontSize: 26,
    textAlign: 'center',
  },
  mrBertSubtitle: {
    fontFamily: 'Fredoka-Regular',
    color: '#FFFFFF',
    fontSize: 17,
    textAlign: 'center',
  },
  mrBertSmallText: {
    fontFamily: 'Fredoka-Regular',
    color: '#FFFFFF',
    fontSize: 20,
  },
  mrBertClockText: {
    fontFamily: 'Fredoka-Regular',
    color: '#FFF',
    fontSize: 20,
  },
  mrBertRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 20,
  },
  mrBertMainBtn: {
    backgroundColor: '#FB8609',
    width: 180,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  mrBertMainBtnText: {
    color: '#14243E',
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
  },
  mrBertIconBtn: {
    width: 56,
    height: 56,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FB8609',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MrBertHabitsKick;
