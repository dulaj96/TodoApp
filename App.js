import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  useColorScheme,
  Switch,
} from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';



const COLORS = {primary: '#1f145c', white: '#fff'};
const App = () => {
    const [textInput, setTextInput] = React.useState("");

    const [todos, setTodos] = React.useState([]);

    const isDarkMode = useColorScheme() === 'dark';
    const [isDark, setIsDark] = React.useState(isDarkMode);


    React.useEffect(() => {
        getTodoFromUserDevice();
    }, []);
    React.useEffect(() => {
        saveTodoDevice(todos);
    }, [todos]);
    const ListItem = ({todo}) => {
        return (
            <View style = {styles.listItem}>
                <View style = {{flex: 1}}>
                    <Text
                        style = {{
                            fontWeight: 'bold',
                            fontSize: 15,
                            color: COLORS.primary,
                            textDecorationLine: todo?.completed ? 'line-through': 'none',
                        }}>
                        {todo?.task}
                    </Text>
                </View>

                {/*if condition*/}
                {!todo?.completed && (
                    <TouchableOpacity
                        style = {styles.actionIcon}
                        onPress={() => markTodoComplete(todo?.id)}
                    >
                        <MaterialCommunityIcons name='check' size={10} color="white" />
                    </TouchableOpacity>)
                }
                <TouchableOpacity
                    style = {[styles.actionIcon, {backgroundColor: 'red'}]}
                    onPress={() => deleteTodo(todo?.id)}
                >
                    <MaterialCommunityIcons name='delete' size={10} color="white" />
                </TouchableOpacity>
            </View>
        );
    }

    const saveTodoDevice = async (todos) => {
        try {
            const stringifyTodos = JSON.stringify(todos)
            console.log("54",stringifyTodos);
            await AsyncStorage.setItem('@storage_Key', stringifyTodos)
        } catch (e) {
            console.log(e);
        }
    };

    const getTodoFromUserDevice = async () => {
        try {
            const todos = await AsyncStorage.getItem('@storage_Key');
            console.log('64',todos);
            if (todos !== null) {
                setTodos(JSON.parse(todos));
            }
        } catch (error) {
            console.log(error);
        }
    };
    const addTodo = () => {
        console.log(textInput);
        if (textInput === '') {
            Alert.alert('Error', 'Please Input ToDo');
        }else {
            const newTodo = {
                id: Math.random(),
                task: textInput,
                completed: false,
            };
            setTodos([...todos, newTodo]);
            console.log(todos);
            setTextInput('');
        }
    }
    const markTodoComplete = (todoId) => {
        const newTodos = todos.map((item) => {
            if (item.id === todoId){
                return {...item, completed: true};
            }
            return item;
        });
        setTodos(newTodos);
    };

    const deleteTodo = (todoId) => {
        const newTodos = todos.filter(item => item.id !== todoId);
        setTodos(newTodos);
    };

    const clearTodo = () => {
        Alert.alert('Confirm', 'Clear todos?',[
            {
                text: 'Yes',
                onPress: () => setTodos([]),
            },
            {
                text: 'No',
            }
        ]);
    };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: isDark?'black':'white'}}>
      <View style={styles.header}>
         <Text style = {{fontWeight: 'bold', fontSize: 20, color:isDark?'white':'black'}}>TODO APP</Text>
         <Switch value={isDark} onValueChange={val => setIsDark(val)} />
        <MaterialCommunityIcons
            name="delete" size={25} color="red" onPress = {clearTodo}/>
      </View>
        <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding: 20, paddingBottom: 100}}
            data={todos} renderItem={({item}) => <ListItem todo={item} />}
                />
        <View style = {[styles.footer, {backgroundColor: isDark ? 'black' : 'white'}]}>
            <View style = {styles.inputContainer}>
                <TextInput
                    placeholder = "Add ToDo"
                    value={textInput}
                    onChangeText={text => setTextInput(text)}
                />
            </View>
            <TouchableOpacity onPress={addTodo}>
                <View style = {styles.iconContainer}>
                    <MaterialCommunityIcons name="plus" size={30} color="blue" />
                </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
    footer: {
      position: 'absolute',
        bottom: 5,
        backgroundColor: COLORS.white,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    inputContainer: {
      backgroundColor: COLORS.white,
        elevation: 40,
        flex: 1,
        height: 50,
        marginRight: 20,
        marginLeft: 10,
        borderRadius: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "black"
    },
    iconContainer: {
      height: 50,
        width: 50,
        backgroundColor: COLORS.white,
        borderRadius: 25,
        elevation: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "blue"
    },
    listItem: {
        padding: 20,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        elevation: 12,
        alignItems: 'center',
        borderRadius: 7,
        marginVertical: 10,
    },
    actionIcon: {
      height: 20,
        width: 20,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
        borderRadius: 3,
    }
});
export default App;
