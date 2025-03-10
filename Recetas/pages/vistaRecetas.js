import {View} from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { getCategoriasFiltro } from '../service/ApiRecetas';
const VistaRecetas = (textFiltro) => {
    const [filtro, setFiltro] = useState({});

    useEffect(() => {
        const fetchFiltro = async () => {
            const data = await getCategoriasFiltro(textFiltro);
            setFiltro(data);
        };
        fetchFiltro();
    }, []);
    console.log('filtro', filtro);
    return(
        <View style={styles.principal}>

        </View>
    )
}

const styles = StyleSheet.create({
    principal: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#DEDEDE',
    },
  });

export default VistaRecetas;