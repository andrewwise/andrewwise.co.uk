---
id: 23
title: 'Virtuemart - Adding Manufacturer Description/Logos to the Product Page'
date: 2011-01-25T21:44:50+00:00
author: Andrew
layout: post
guid: https://www.andrewwise.co.uk/?p=23
permalink: /2011/01/25/virtuemart-adding-manufacturer-descriptionlogos-to-the-product-page/
categories:
  - Virtuemart
tags:
  - brand
  - code
  - core
  - core hack
  - description
  - fluypage
  - hack
  - logos
  - manufacturer
  - product
  - virtuemart
---
I was asked to make the manufacturer logos appear in the in the product flypage, I was partly surprised this wasn't an option but more surprised that there isn't a way built into Virtuemart (v1.1.3) to display the manufacturer description in the flypage. So I deicide I would make one and use it to display the logo as we didn't use the description for anything else.

<!--more-->

Firstly, find this in `administrator/components/com_virtuemart/classes/ps_product.php`:
  

```
function get_mf_name($product_id) {
  $db = new ps_DB;

  $q = "SELECT mf_name,#__{vm}_manufacturer.manufacturer_id FROM #__{vm}_product_mf_xref,#__{vm}_manufacturer ";
  $q .= "WHERE product_id='$product_id' ";
  $q .= "AND #__{vm}_manufacturer.manufacturer_id=#__{vm}_product_mf_xref.manufacturer_id";

  $db->query($q);
  $db->next_record();
  if ($db->f("mf_name")) {
    return $db->f("mf_name");
  }
  else {
    return "";
  }
}
```

And add this after it, it's basically a rework of the above code, but for the manufacturer description:
  

```
function get_mf_desc($product_id) {
  $db = new ps_DB;

  $q = "SELECT mf_desc,#__{vm}_manufacturer.manufacturer_id FROM #__{vm}_product_mf_xref,#__{vm}_manufacturer ";
  $q .= "WHERE product_id='$product_id' ";
  $q .= "AND #__{vm}_manufacturer.manufacturer_id=#__{vm}_product_mf_xref.manufacturer_id";

  $db->query($q);
  $db->next_record();
  if ($db->f("mf_desc")) {
    return $db->f("mf_desc");
  }
  else {
    return "";
  }
}
```

Then, in the product_snapshot function find this line:
  
```
$tpl->set( 'manufacturer_name', $this->get_mf_name($product_id));
```

And add straight after it, this line of code (this can also be added to all the other snapshot functions, if you want to use the manufacturer description in other places):
  
```
$tpl->set( 'manufacturer_desc', $this->get_mf_desc($product_id));
```

Next we need to edit `administrator/components/com_virtuemart/html/shop.product_details.php` so again find this line:
  
```
$manufacturer_name = $ps_product->get_mf_name($product_id);
```

And add directly below it:
  
```
$manufacturer_desc = $ps_product->get_mf_desc($product_id);
```

Then, towards the end of the file find this:
  
```
$tpl->set( "manufacturer_name", $manufacturer_name );
```

And add this directly after it:
  
```
$tpl->set( "manufacturer_desc", $manufacturer_desc );
```

Finally we can add the description to our product flypage! So open up whichever flypage you're using and just paste this code anywhere you want to use it:
  
```
<?php echo $manufacturer_desc ?>
```

Now you can put whatever you want in the manufacturer description and it will appear in the flypage.