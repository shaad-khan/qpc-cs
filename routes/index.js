var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
/* GET home page. */
router.get('/:id', function(req, res, next) {
  var id=req.params.id;
  var conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://gatesair--gdata.cs94.my.salesforce.com'
  });
  conn.login('shadab.k@cs.gair.com.gdata', 'Zeba@1233RKDBzi2yoHu86KuWnhYJVFmJ', function(err, userInfo) {
    if (err) { return console.error(err); }

    var x=data("select id,name,SBQQ__Group__c,SBQQ__UnitCost__c,SBQQ__Product__r.productcode,Warranty_Cost_Incremental_Rate__c,SBQQ__ListPrice__c from SBQQ__QuoteLine__c where SBQQ__Quote__c ='"+id+"' and SBQQ__ProductFamily__c='Bundles'");

  function data(sql){
  return new Promise((resolve, reject)=>{

    conn.query(sql, function(err, result) {
    if (err) {
      return reject(error); }
    return resolve(result);
  });
});
}
x.then((d)=>{

});
var y=data("select id,name,Product_Source__c,SBQQ__Optional__c,SBQQ__REQUIREDBY__c,Total_Cost__c,SBQQ__Group__c,SBQQ__UnitCost__c,SBQQ__Product__r.productcode,Warranty_Cost_Incremental_Rate__c,SBQQ__ListPrice__c from SBQQ__QuoteLine__c where SBQQ__Quote__c ='"+id+"' and SBQQ__REQUIREDBY__c != null and SBQQ__Product__r.productcode not IN('WNTY_EXTD_24MO','WNTY_EXTD_36MO','WNTY_EXTD_48MO','WNTY_EXTD_60MO')");
var z=data("select id,name,SBQQ__GrossProfit__c,SBQQ__SpecialPrice__c,SBQQ__AdditionalDiscount__c,SBQQ__NetPrice__c,SBQQ__REQUIREDBY__c,SBQQ__Discount__c,Total_Cost__c,SBQQ__Group__c,SBQQ__UnitCost__c,SBQQ__Product__r.productcode,Warranty_Cost_Incremental_Rate__c,SBQQ__Quantity__c,SBQQ__ListPrice__c,SBQQ__ProductCode__c from SBQQ__QuoteLine__c where SBQQ__Quote__c ='"+id+"' and SBQQ__Product__r.productcode in ('WNTY_EXTD_24MO','WNTY_EXTD_36MO','WNTY_EXTD_48MO','WNTY_EXTD_60MO')");
var ucost=0;
var nprice=0;
var lprice=0
var i=1;
Promise.all([x, y, z]).then(function(values) {
 //console.log(JSON.stringify(values[1].records,null, 2));
  //console.log(JSON.stringify(values[1].records[1].SBQQ__REQUIREDBY__c,null, 2));
 //fs.writeFile('myjsonfile.json', JSON.stringify(values[1].records,null, 2));
for(x of values[0].records)
{
  
 // console.log("x id:  "+x.Id);
for(y of values[1].records)
{
 // console.log(y.SBQQ__Optional__c);
 
 
  if((x.Id==y.SBQQ__RequiredBy__c)&&(y.Product_Source__c=='Produced')&& (y.SBQQ__Optional__c.toString() =='false'))
  {
    
    //console.log("here");
    ucost=ucost+y.Total_Cost__c;
  // console.log("inside loop :"+ucost);
  }
}
for(z of values[2].records)
{
  if(x.Id==z.SBQQ__RequiredBy__c)
  {
    
  if(z.SBQQ__Quantity__c!=0)
{
  console.log("id :"+z.Id+" --- product code : "+z.SBQQ__ProductCode__c);
  var cal=(z.Warranty_Cost_Incremental_Rate__c/100) * ucost;
  cal=cal / z.SBQQ__Quantity__c;
    console.log(`new unit cost  for line item ${i}: `+cal);
    i++;
    lprice= cal * 1.3;
    lprice= lprice.toFixed(2);
    if(z.SBQQ__Discount__c==null){
       nprice = lprice;
    }
   if(z.SBQQ__Discount__c!=null){
    nprice = lprice - z.SBQQ__Discount__c;}
   if(z.SBQQ__AdditionalDiscount__c==null){
        nprice= lprice;
    }
   if(z.SBQQ__AdditionalDiscount__c!=null){
        nprice =lprice - z.SBQQ__AdditionalDiscount__c;}

        var body ={id:z.Id,ucost:cal,listprice:lprice,netprice:nprice};
        conn.apex.put('/rest-test',body )
        .then(results => {
            console.log('Results', results);
           // resolve();
        })
        .catch(err => {
            console.error('Error', err);
           // resolve(); // resolving so entire process does not halt
        })





  }
}

}

ucost=0;
lprice=0;
nprice=0;
}
//var


/*for(j of values[1].records)
{
  console.log(j['SBQQ__RequiredBy__c']);

}*/

});




  });

  res.json("done");
});

module.exports = router;
