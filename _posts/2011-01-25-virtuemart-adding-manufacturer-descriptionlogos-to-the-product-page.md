---
id: 23
title: 'Virtuemart &#8211; Adding Manufacturer Description/Logos to the Product Page'
date: 2011-01-25T21:44:50+00:00
author: Andrew
layout: post
guid: http://www.andrewwise.co.uk/?p=23
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
I was asked to make the manufacturer logos appear in the in the product flypage, I was partly surprised this wasn&#8217;t an option but more surprised that there isn&#8217;t a way built into Virtuemart (v1.1.3) to display the manufacturer description in the flypage. So I deicide I would make one and use it to display the logo as we didn&#8217;t use the description for anything else.

<!--more-->

Firstly, find this in administrator/components/com\_virtuemart/classes/ps\_product.php:
  


    &nbsp;&nbsp;function get_mf_name($product_id) {
    &nbsp;&nbsp;&nbsp;&nbsp;$db = new ps_DB;
    
    &nbsp;&nbsp;&nbsp;&nbsp;$q = "SELECT mf_name,#__{vm}_manufacturer.manufacturer_id FROM #__{vm}_product_mf_xref,#__{vm}_manufacturer ";
    &nbsp;&nbsp;&nbsp;&nbsp;$q .= "WHERE product_id=&#039;$product_id&#039; ";
    &nbsp;&nbsp;&nbsp;&nbsp;$q .= "AND #__{vm}_manufacturer.manufacturer_id=#__{vm}_product_mf_xref.manufacturer_id";
    
    &nbsp;&nbsp;&nbsp;&nbsp;$db->query($q);
    &nbsp;&nbsp;&nbsp;&nbsp;$db->next_record();
    &nbsp;&nbsp;&nbsp;&nbsp;if ($db->f("mf_name")) {
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return $db->f("mf_name");
    &nbsp;&nbsp;&nbsp;&nbsp;}
    &nbsp;&nbsp;&nbsp;&nbsp;else {
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return "";
    &nbsp;&nbsp;&nbsp;&nbsp;}
    &nbsp;&nbsp;}

And add this after it, it&#8217;s basically a rework of the above code, but for the manufacturer description:
  


    &nbsp;&nbsp;function get_mf_desc($product_id) {
    &nbsp;&nbsp;&nbsp;&nbsp;$db = new ps_DB;
    
    &nbsp;&nbsp;&nbsp;&nbsp;$q = "SELECT mf_desc,#__{vm}_manufacturer.manufacturer_id FROM #__{vm}_product_mf_xref,#__{vm}_manufacturer ";
    &nbsp;&nbsp;&nbsp;&nbsp;$q .= "WHERE product_id=&#039;$product_id&#039; ";
    &nbsp;&nbsp;&nbsp;&nbsp;$q .= "AND #__{vm}_manufacturer.manufacturer_id=#__{vm}_product_mf_xref.manufacturer_id";
    
    &nbsp;&nbsp;&nbsp;&nbsp;$db->query($q);
    &nbsp;&nbsp;&nbsp;&nbsp;$db->next_record();
    &nbsp;&nbsp;&nbsp;&nbsp;if ($db->f("mf_desc")) {
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return $db->f("mf_desc");
    &nbsp;&nbsp;&nbsp;&nbsp;}
    &nbsp;&nbsp;&nbsp;&nbsp;else {
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return "";
    &nbsp;&nbsp;&nbsp;&nbsp;}
    &nbsp;&nbsp;}

Then, in the product_snapshot function find this line:
  
`$tpl->set( &#039;manufacturer_name&#039;, $this->get_mf_name($product_id));`

And add straight after it, this line of code (this can also be added to all the other snapshot functions, if you want to use the manufacturer description in other places):
  
`$tpl->set( &#039;manufacturer_desc&#039;, $this->get_mf_desc($product_id));`

Next we need to edit administrator/components/com\_virtuemart/html/shop.product\_details.php so again find this line:
  
`$manufacturer_name = $ps_product->get_mf_name($product_id);`

And add directly below it:
  
`$manufacturer_desc = $ps_product->get_mf_desc($product_id);`

Then, towards the end of the file find this:
  
`$tpl->set( "manufacturer_name", $manufacturer_name );`

And add this directly after it:
  
`$tpl->set( "manufacturer_desc", $manufacturer_desc );`

Finally we can add the description to our product flypage! So open up whichever flypage you&#8217;re using and just paste this code anywhere you want to use it:
  
`<?php echo $manufacturer_desc ?>`

Now you can put whatever you want in the manufacturer description and it will appear in the flypage.