'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import cropIcons from "./vegetables/index";
import "./page.css";
import { AddCircle, Delete, Inventory, RemoveCircle } from "@mui/icons-material";
import React from "react";
import Image from "next/image";
import { searchVegetables } from "./vegetables";
import { green, red } from "@mui/material/colors";

type Item = {
  label: string;
  count: number;
  icon?: keyof typeof cropIcons;
}


const Home = () => {
  const [data, setDataState] = React.useState<Item[]>(
    () => {
      const storedData = typeof window !== "undefined" ?
        window.localStorage.getItem('items') : undefined;
      if(storedData) {
        return JSON.parse(storedData);
      }
      return [];
    }
  );
  const [newItem, setNewItem] = React.useState('');
  const [newIcon, setNewIcon] = React.useState<keyof typeof cropIcons | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  const setData = (newData: Item[]) => {
    setDataState(newData);
    localStorage.setItem('items', JSON.stringify(newData));
  }

  const handleAdd = () => {
    setData([...data, {label:newItem, count:1, icon: selectedIcon}]);
    setOpen(false);;
  }

  const sortedData = data.toSorted((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);

  const veg = open && newItem ? searchVegetables(newItem).slice(0, 4) : [];
  const vegExtended = newIcon && !veg.includes(newIcon) ? [...veg.slice(0, 3), newIcon] : veg;
  const selectedIcon = newIcon && vegExtended.includes(newIcon) ? newIcon : veg[0];

  return (
    <>
      <Stack
        direction="row"
        paddingY={1}
        paddingX={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          baby-food
        </Typography>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={() => {
            setNewItem('');
            setNewIcon(undefined);
            setOpen(true);
          }}
        >
          Add
        </Button>
      </Stack>
      <Divider />
      <List>
        {sortedData.map(({label, count, icon}, idx) => (
          <ListItem key={label}
            secondaryAction={
              <Stack direction="row" alignItems="center">
                <Stack direction="row" paddingRight={1}>
                {[...Array(Math.min(12, count))].map((e, i) => (
                  <div key={i} style={{width:4, height:16, backgroundColor:count<=12 ? green[400]: red[400], marginLeft:4, borderRadius:2}}></div>
                ))}
                </Stack>
                {count === 0 ?
                  <IconButton aria-label="remove" onClick={() => {
                    setData(sortedData.filter((_ ,i ) => i !== idx));
                  }}>
                    <Delete />
                  </IconButton> :
                  <IconButton aria-label="decrease" onClick={() => {
                    setData(sortedData.map((item ,i ) => i === idx ? {...item, count: item.count - 1} : item));
                  }}>
                    <RemoveCircle />
                  </IconButton>
                }
                <IconButton aria-label="increase" onClick={() => {
                  setData(sortedData.map((item ,i ) => i === idx ? {...item, count: item.count + 1} : item));
                }}>
                  <AddCircle />
                </IconButton>
              </Stack>
            }>
            <ListItemAvatar>
                { icon ? <Image src={cropIcons[icon]} alt="" width={40} height={40} /> : <Inventory/>}
            </ListItemAvatar>
            <ListItemText primary={label} secondary={`${count}`} />
          </ListItem>
        ))}

      </List>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        disableRestoreFocus
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleAdd();
          },
        }}
      >
        <DialogTitle>Add a new item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="normal"          
            label="Name"
            fullWidth
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onSubmit={() => {
              setData([...data, {label:newItem, count:0}]);
              setOpen(false);
            }}
          />
          {newItem.length > 0 && (
            <ToggleButtonGroup  exclusive value={selectedIcon} onChange={(e , v) => v && setNewIcon(v)}>
              {vegExtended.map((icon) => (
                <ToggleButton value={icon} key={icon}>
                  <Image src={cropIcons[icon]} alt="" width={40} height={40} />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpen(false);
          }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={newItem.length === 0}
            >Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;