import { BannerAd, BannerAdSize, TestIds, InterstitialAd } from 'react-native-google-mobile-ads';
import {StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFetchBlob from 'rn-fetch-blob';
import { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';

var DataCollection = 
{
  "Members": [
      {"id": 0, "Name": "Everglow", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/1.jpg"},
      {"id": 1, "Name": "Aisha", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/7.jpg"},
      {"id": 2, "Name": "Onda", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/6.jpg"},
      {"id": 3, "Name": "Yirein", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/3.jpg"},
      {"id": 4, "Name": "E:U", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/2.jpg"},
      {"id": 5, "Name": "Sihyeon", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/4.jpg"},
      {"id": 6, "Name": "Mia", "Cover": "https://pouriaafshari.github.io/Everglow-Wallpaper/5.jpg"}
  ]
}

let WallpaperJson = [];

async function GetData()
{
  const Response = await fetch("https://pouriaafshari.github.io/Everglow-Wallpaper/Everglow.json");
  const Data = await Response.json();
  if (Response.ok)
  {
    WallpaperJson = Data.Wallpapers;
    console.log(Data.Wallpapers);
  }
}
GetData();

const interad = InterstitialAd.createForAdRequest("ca-app-pub-4916084825755749/1487677843");

function MoneyTree()
{
    if (!interad.loaded) {interad.load()}
    if (interad.loaded)
    {
      interad.show();
    }
}

const Stack = createNativeStackNavigator();

export default App = () => {
  useEffect(()=>{SplashScreen.hide()})

  return(
    <View style={styles.AppContainer}>

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Menu' component={Menu} options={{headerShown: false}}/>
          <Stack.Screen name='Wallpaper' component={WallpaperList}/>
          <Stack.Screen name='Full size' component={FullSize}/>
        </Stack.Navigator>
      </NavigationContainer>

      <BannerAd
        unitId={"ca-app-pub-4916084825755749/3493140064"}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

function Menu({ navigation })
{
  return (
    <View style={{flex: 1}}>
      {DataCollection.Members.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.button}
          onPress={()=>{navigation.navigate("Wallpaper", {Idol: item.id})}}
        >
          <Image source={{uri: item.Cover}} style={styles.img} />
          <Text style={styles.buttonText}>{item.Name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function WallpaperList({route, navigation})
{
  const Item = (item)=>
  {
    const loadingimg = require("./Loading.png")
    return(
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={()=>{navigation.navigate("Full size", {url: item.item})}}>
          <Image defaultSource={loadingimg} source={{ uri: item.item }} style={styles.image}/>
        </TouchableOpacity>
      </View>
    )
  }

  return(
    <FlatList
      data={WallpaperJson[route.params.Idol]}
      renderItem={({item}) => <Item item={item.url} />}
      keyExtractor={item => item.id}
      numColumns={3}/>
  )
}

function FullSize({route})
{
  useEffect(()=>
  {
    MoneyTree();
  }, [])

  const handleDownload = async () => {
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'jpg',
    })
      .fetch('GET', route.params.url)
      .then(res => {
        CameraRoll.save(res.data, 'photo')
          .then(res => console.log(res))
          .catch(err => console.log(err))
        Alert.alert("Download success.")
      })
      .catch(error => console.log(error));
  };

  return(
    <View>
      <Image source={{ uri: route.params.url }} style={{ width: 'auto', height: '100%' }} />
      <View style={styles.container2}>
        <TouchableOpacity style={styles.buttonContainer2} onPress={handleDownload}>
          <Text style={styles.buttonText2}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  AppContainer:
  {
    flex: 1
  },
  MenuItemContainer:
  {
    flex: 1
  },
  button: 
  {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'start',
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  img: 
  {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  buttonText: 
  {
    fontSize: 40,
    fontWeight: 'bold',
    position: 'absolute',
    opacity: 0.6,
    color: 'black',
    marginLeft: 10
  },
  imageContainer: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: '100%',
    maxWidth: 250,
    height: 290,
    borderRadius: 5,
  },
  container2: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  buttonContainer2: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },
  buttonText2: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0
  }
});

