'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, IconButton, Modal, Stack, StepIcon, TextField, Typography} from "@mui/material";
import { collection, doc, getDoc, getDocs, query, deleteDoc, setDoc } from "firebase/firestore";

type InventoryItem = {
  name: string;
  quantity: number;
};

export default function Home() {
  // Explicitly typing the inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  //async means that it will not block the code while fetching
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));  //This basically looks at inventory
    const docs = await getDocs(snapshot);
    const inventoryList: InventoryItem[] = [];
    docs.forEach((doc) => {
      const data = doc.data() as Omit<InventoryItem, 'name'>;
      inventoryList.push({
        name: doc.id,
        ...data,
      });
    });
    setInventory(inventoryList);
    console.log(inventory);
  }

  useEffect(() => {
    updateInventory();
  }, []);

  //Helper function that lets us remove items
  const removeItem = async (itemName: string) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data() as InventoryItem;
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
  }

  //Helper function for adding items
  const addItem = async (itemName: string) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data() as InventoryItem;
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#720"
    >
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          position="absolute"
          left="50%"
          top="50%"
          width="400px"  // Ensure width is specified as a string with "px"
          bgcolor="white"
          border="2px solid #11"
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)"
          }}
        >
          <Typography variant="h6"
          > ADD ITEM</Typography>
          <Stack 
          width="100%"
          height="100%"
          direction="column"
          spacing={2}>
            <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }}
           />
            <Button
            variant="outlined"
            onClick={()=>{
              addItem(itemName)
              setItemName('')
              handleClose
            }} >
              Add
            </Button>

          </Stack>
        </Box>
      </Modal>
      <Button
      variant ="contained"
      location = "center"
      sx={{
        transform: "translate(300%,1900%)"
      }}
      onClick={()=> {
        handleOpen()
      }}> New Item 
      </Button>
      <Box 
      border="1px solid #333"
      >
        <Box
        width="800px"
        height = "125px"
        bgcolor="#991"
        alignItems="center"
        justifyContent="center"
        display="flex">
          <Typography 
          variant="h2"
          
          color="#1">Inventory</Typography>


      </Box>
      <Stack
      width="800"
      height="500px"
      boarder = "white"
      spacing={2}
      overflow="auto">
        {
        inventory.map(({name, quantity})=> (
          <Box 
          key={name} 
          width="100%"
          minHeight="150px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#740"
          padding={5}
          >
            <Typography 
            variant="h3"
            color="yellow"
            textAlign="center"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Stack direction="row" spacing={2}>
            <Typography
            variant="h4"
            color="white"
            textAlign="center">
              {quantity}
            </Typography>

            <Button
            variant ="contained"
            color ="success"
            onClick={() => {
              addItem(name)
            }}
            > <Typography
            variant="h6"
            color="white"
            >Add</Typography>
            
            </Button>

            <Button
            variant = "contained"
            color ="error"
            onClick={() => {
              removeItem(name)
            }}
            >
              Remove 
            </Button>
            </Stack>
          </Box>
        ))
      }
      </Stack>
      </Box>
    </Box>
  );
}