import React,{useEffect,useState}from 'react';
import{
    View,
    Text,
    KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    Image,
    Animated
}from 'react-native'

import RNPickerSelect from 'react-native-picker-select';

import EventEmmitter from 'react-native-eventemitter';

import jwt from 'react-native-pure-jwt';

const animation = new Animated.Value(0)

const URI = 'http://192.168.1.67:3000/ParkingApp/API/99042101849'
const KEY_API = '99042101849'

const APIvehiculesAdd = (data)=>{
    
    fetch(URI+'/vehicules/save/app',{
        method:'PUT',
        body:JSON.stringify(data),
        headers:{'Content-Type': 'application/json'}
    }).then(res => res.json())
      .then(res => {console.log(res)
        if(res.status === 'ok'){
          alert('Vehiculo Agregado')
          EventEmmitter.emit('addComplete',true)
        }
       }
      )
      .catch(e=>{console.log(e)})
}

const appear = ()=>{
    Animated.timing(
        animation,
        {
            toValue:1,
            duration:700,
        }
    ).start()
}

const PopUpAdd = (props)=>{
    let [selectPicker,setSelectPicker] = useState(1),
        [placa,setPlaca] = useState(''),
        [marca,setMarca] = useState(''),
        [photo,setPhoto] = useState(),
        [email,setEmail] = useState('')
    useEffect(()=>{
        appear()
        setEmail(props.emailGet)
    },[])
    return(
        <View style={styles.container}>
        <Animated.View 
         style={{opacity:animation}}
        >
           
            <KeyboardAvoidingView>
                <View 
                 style={styles.PopUp}>
                   <View style={styles.header}>
                       <View style={{marginTop:10}}>
                       <TouchableOpacity
                        onPress={()=>{
                            EventEmmitter.emit('closePopUp',true)
                        }}
                       >
                         <Image source={require('../Images/cerrar.png')} style={{width:25,height:25}}/>
                       </TouchableOpacity>
                       </View>
                       <View style={{marginHorizontal:20,marginTop:10}}>
                       <Text style={styles.textBtnAdd}>
                           Nuevo vehiculo
                       </Text>
                       </View>
                   </View>
                   <ScrollView style={styles.ScrollContainer}>
                       <View style={{alignItems:'center'}}>
                   <TextInput 
            autoCapitalize={'characters'}
            onChangeText={(value)=>{
                if(value.length<7){
                    setPlaca(value)
                }
            }}
            value={placa}
            style={styles.InputAdd}
             placeholder='Placa de tu vehiculo'/>
            <Text>Selecciona el tipo de vehiculo</Text>
            <View
             style={styles.InputAdd}
            >
            <RNPickerSelect
              
              onValueChange={(value)=>{
                  setSelectPicker(value)
              }}
              

              items={[
                  {label:'carro',value:1},
                  {label:'moto',value:2}
              ]}
              
            />
            </View>
            <Text>Marca de vehiculo</Text>
             <TextInput 
             onChangeText={(value)=>{
                 setMarca(value)
             }}
            style={styles.InputAdd}
             placeholder='Marca'/>
                       </View>
                   </ScrollView>
                   <TouchableOpacity 
                     style={styles.BtnAdd}
                     onPress={()=>{
                        const data = {
                            email:email,
                            idVehicule:placa,
                            type:selectPicker,
                            marca:marca
                        }
                        jwt.sign(data,KEY_API,{alg:'HS256'}).then(token => {
                         const sendApi = {
                             token:token
                         }
                         APIvehiculesAdd(sendApi)
                         
                      })
                     }}
                     >
                       <View>
                           <Text style={styles.textBtnAdd}>Agregar vehiculo</Text>
                       </View>
                   </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        position:'absolute',
        top:0,
        left:0,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        backgroundColor:'rgba(0,0,0,0.4)',
        alignItems:'center',
        justifyContent:'center'
    },
    PopUp:{
        width:Dimensions.get('window').width*0.85,
        height:Dimensions.get('window').height*0.65,
        backgroundColor:'white',
        borderRadius:20,
        alignItems:'center'
    },
    BtnAdd:{
        width:'80%',
        height:50,
        backgroundColor:'#58C800',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginVertical:15
    },
    textBtnAdd:{
        color:'white',
        fontSize:18,
        fontWeight:'bold'
    },
    InputAdd:{
        width:'80%',
        height:50,
        marginVertical:15,
        borderWidth:1,
        borderColor:'#770BC2',
        borderRadius:10,
    },
    ScrollContainer:{
        width:'100%'
    },
    header:{
        height:55,
        backgroundColor:'#770BC2',
        width:'100%',
        borderBottomEndRadius:40,
        borderBottomStartRadius:40,
        marginBottom:10,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'center',
        
    }

})

export default PopUpAdd