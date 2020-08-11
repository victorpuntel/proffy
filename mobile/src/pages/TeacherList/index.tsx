import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import styles from './styles';

function TeacherList(){
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const [subject, setSubject] = useState('');
    const [week_day, setWeek_day] = useState('');
    const [time, setTime] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    function LoadFavorites(){
        AsyncStorage.getItem('favorites').then(response => {
            if(response){
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersId = favoritedTeachers.map((teacher: Teacher) => teacher.id);

                setFavorites(favoritedTeachersId);
            }
        });
    }

    useEffect(() => {
        LoadFavorites();

        api.get('/classes', {
            params: {
                subject,
                week_day,
                time
            }
        }).then(resp => {
            setTeachers(resp.data);
            setIsFilterVisible(false);
        });
    }, []);

    function handleFilterVisible(){
        setIsFilterVisible(!isFilterVisible);
    }

    function handleFiltersSubmit(){
        LoadFavorites();

        
        
    }

    return (
        <View style={styles.container}>
            <PageHeader title="Proffys disponíveis" headerRight={
                <BorderlessButton onPress={handleFilterVisible}>
                    <Feather name="filter" size={20} color="#fff" />
                </BorderlessButton>
            }>
                { isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput value={subject} onChangeText={text => setSubject(text)} placeholderTextColor="#c1bccc" style={styles.input} placeholder="Qual a matéria?"/>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput value={week_day} onChangeText={text => setWeek_day(text)} placeholderTextColor="#c1bccc" style={styles.input} placeholder="Qual o dia?"/>
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput value={time} onChangeText={text => setTime(text)} placeholderTextColor="#c1bccc" style={styles.input} placeholder="Qual o horário?"/>
                            </View>
                        </View>

                        <RectButton onPress={handleFiltersSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>

                    </View>
                )}
            </PageHeader>

            <ScrollView style={styles.teacherList} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                { teachers.map((teacher: Teacher) => <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)}/>)}
                
            </ScrollView>
        </View>
    )
}

export default TeacherList;