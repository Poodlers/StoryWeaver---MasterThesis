import { Icon, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import maps from '../../data/maps';
import { primaryColor, secondaryColor, tertiaryColor, textColor } from '../../themes';

function SelectLocationField(props) {
  const label = props.data.label;
  const style = props.style;
  const value = props.value;
  const handleFieldChange = props.onChange;
  const [selectedMap, setSelectedMap] = React.useState(maps.find(map => map.name == value.map));


  return (
      <Box sx={{display: 'flex', width:'100%' , flexDirection: 'column', alignItems:'center', justifyContent:'center', ...style}}>
        <Box sx={{display: 'flex', width:'100%' , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

        
        <Typography variant="h7" component="div" sx={{ flexGrow: 1, py:1, px:2, color: textColor, m:0, textAlign:'start'}}>
            {label}
        </Typography>
        <Select
          
            sx={{color: 'black', backgroundColor: 'white', padding: 0, margin: 0,  mr:'10px', 
            outline: 'none', height: 40, width: '35%'
            }}
            value={value.trigger_mode}
           
            onChange={(event) => {
                handleFieldChange(props.data.name, {trigger_mode: event.target.value, 
                map: value.map, place: value.place, qr_code: value.qr_code} );
            }}
        >
        <MenuItem sx={{color: 'black'}} value={"GPS Coords"}>GPS Coords</MenuItem>
        <MenuItem sx={{color: 'black'}} value={"QR-Code"}>QR-Code</MenuItem>

        </Select>
        </Box>
        
        <Box sx = {{backgroundColor: primaryColor, width: '100%', mt: 2}}>
            <Typography variant="h7" component="div" sx={{ py:1, px:2, color: textColor, m:0}}>
                Localização:
            </Typography>
        </Box>

        {
            value.trigger_mode === "GPS Coords" ?
            maps.length > 0 ?
            <Box  sx={{display: 'flex',  width:'100%', flexDirection: 'column', alignItems: 'center', justifyContent:'center',m:0, mt:2, }}>
                

                <Box sx={{display: 'flex',  width:'100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                    <Typography variant="h7" component="div" sx={{ py:1, px:2, color: textColor, m:0, textAlign:'start'}}>
                        Mapa:
                    </Typography>
                    <Select
                        sx={{color: 'black', backgroundColor: 'white', width:'50%', height: 40, padding: 0, margin: 0, mr:'10px'}}
                        value={value.map}
                        onChange={(event) => {
                            handleFieldChange(props.data.name, {trigger_mode: value.trigger_mode, 
                            map: event.target.value, place: value.place, qr_code: value.qr_code} );
                            setSelectedMap(maps.find(map => map.name == event.target.value));
                              
                        }}
                    >
                        {
                            maps.map((map, index) => {
                                return <MenuItem  sx={{color: 'black'}} key={index} value={map.name}>{map.name}</MenuItem>
                            })
                        }
                        
    
                    </Select>

                </Box>
                
                <Box sx={{display: 'flex',  width:'100%', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', mt:2}}>
                    <Typography variant="h7" component="div" sx={{ py:1, px:2, color: textColor, m:0}}>
                        Place:
                    </Typography>
                    <Select
                       sx={{color: 'black', backgroundColor: 'white', width:'50%',  height: 40, padding: 0, margin: 0, mr:'10px'}}
                        value={value.place}
                        SelectDisplayProps = {{style: {display: 'flex', 
                        flexDirection: 'row', alignItems:'center', justifyContent:'left'}}}
                        onChange={(event) => {
                            handleFieldChange(props.data.name, {trigger_mode: value.trigger_mode, 
                            map: value.map, place: event.target.value, qr_code: value.qr_code} );
                        }}
                    >
                    {
                        selectedMap == undefined ? null :
                        selectedMap.places.map((place, index) => {
                            return <MenuItem sx={{color: 'black', display: 'flex', 
                            flexDirection: 'row', alignItems:'center', justifyContent:'left'}} key={index} value={place.name}>
                                <Icon sx={{fontSize: 20, color: 'black', mr: 1}}>{place.icon}</Icon>   
                                {place.name}
                                </MenuItem>
                        })
                    }
                    </Select>
                </Box>
                

            
            </Box>
            :
            <Typography variant="h7" component="div" sx={{ py:1, px:2, color: textColor, m:0}}>
                Nenhum mapa disponível - Adicione um mapa!
            </Typography>
            :
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt:2}}>
                <Typography variant="h6" component="div" sx={{ px:2, color: textColor, m:0}}>
                    QR-Code:
                </Typography>
                <Typography variant="h7" component="div" sx={{px:2, color: textColor, m:0, fontSize: 14}}>
                    Imprima o código QR abaixo e coloque no local onde quer que a animação esteja!
                </Typography>

                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt:2}}>
                    <Typography variant="h7" component="div" sx={{ py:1, px:1, color: textColor, m:0}}>
                        Código:
                    </Typography>
                    
                    <TextField 
                        inputProps={{style: {color: 'black', height: 40, padding: 0, margin: 0,
                        backgroundColor: "#ffffff",
                        borderRadius: 10,
                        }}}
                        sx={{ flexGrow: 1, py:0, px:2, color: textColor, mx:'10px', 
                        borderRadius:0,
                        '.MuiInputBase-root': {
                            borderRadius: 2,
                            backgroundColor: "#ffffff",
                        },
                        }}
                        id="outlined-basic" variant="outlined" 
                        value={value.qr_code}
                        onChange={(event) => {
                            handleFieldChange(props.data.name, {trigger_mode: value.trigger_mode, 
                            map: value.map, place: value.place, qr_code: event.target.value} );
                        }}
                        />
                        <Icon fontSize='large' sx={{fontSize: '100px', color: 'black'}}>print</Icon>
                </Box>
            </Box>
        }
  

      </Box>
    );
}

export default SelectLocationField;
