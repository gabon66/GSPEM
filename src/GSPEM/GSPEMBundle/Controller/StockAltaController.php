<?php

namespace GSPEM\GSPEMBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use GSPEM\GSPEMBundle\Entity\StockSitio;

use GSPEM\GSPEMBundle\Entity\StockMaestro;
use GSPEM\GSPEMBundle\Entity\MovStockTec;
use GSPEM\GSPEMBundle\Entity\StockItemsMov;
use GSPEM\GSPEMBundle\Entity\StockTecnico;
use GSPEM\GSPEMBundle\Entity\AltaStock;





use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Session;
use Symfony\Component\VarDumper\Cloner\Data;

class StockAltaController extends Controller
{

    /**
     * Set Stock to Maestro
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return Response
     */
    public function setStockAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $materialalertados=[];
        foreach (json_decode($request->getContent(),true)["items"] as $item){

            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');
            $stock = $repo->findOneBy(array("material"=>$item['id']));
            $stock->setCant($item['stock']);


            if(isset($item['altaData'])){
                // inserto altas si tengo ,
                $alta = new AltaStock();
                $alta->setMaterial($item['altaData']['id']);
                $alta->setObs($item['altaData']['obs']);
                $alta->setDate(new \DateTime($item['altaData']['date']));
                $alta->setStock($item['altaData']['new_stock']);
                $alta->setIdProv($item['altaData']['prov']);
                $em->persist($alta);
            }

            $em->flush();

        }


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * Edit Alta Stock
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return Response
     */
    public function setAltaAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();


        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\AltaStock');

        $data=json_decode($request->getContent(),true);
        $alta = $repo->findOneBy(array("id"=>$data["id"]));

        $alta->setObs($data["obs"]);
        $alta->setDate(new \DateTime($data["date"]));
        $alta->setIdProv($data["new_prov_id"]);
        $em->flush();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }



    /**
     * Get Altas de stock by Material
     * @param $id
     */
    public function getAltasStockAction($id){
        $em = $this->getDoctrine()->getEntityManager();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("astock.id as id ,   astock.date as date ,astock.obs as obs, pr.id as prov_id, pr.name as prov , astock.stock as stock")
            ->from("alta_stock", "astock")
            ->innerJoin("astock", "contratistas", "pr", "pr.id = astock.id_prov")
            ->where("astock.material=".$id)
            ->orderBy('astock.date', 'DESC')
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * Get Altas de stock by Material
     * @param $id
     */
    public function reportsAltasStockAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select(" mat.id as id , mat.id_custom as idCustom , mat.descript as descript , mat.name as name,   astock.date as date ,astock.obs as obs, pr.name as prov ,pr.id as prov_id, astock.stock as stock")
            ->from("alta_stock", "astock")
            ->innerJoin("astock", "contratistas", "pr", "pr.id = astock.id_prov")
            ->innerJoin("astock", "materiales", "mat", "astock.material = mat.id")
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }



}
