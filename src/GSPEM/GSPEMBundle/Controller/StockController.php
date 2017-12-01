<?php

namespace GSPEM\GSPEMBundle\Controller;

use GSPEM\GSPEMBundle\Entity\StockSitio;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use GSPEM\GSPEMBundle\Entity\StockMaestro;
use GSPEM\GSPEMBundle\Entity\MovStockTec;
use GSPEM\GSPEMBundle\Entity\StockItemsMov;
use GSPEM\GSPEMBundle\Entity\StockTecnico;




use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Session;


class StockController extends Controller
{

    public function getMaterialesStockAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.ubicacion as ubicacion, m.umbralmax as umbralmax , m.umbralmin as umbralmin,m.referencia as referencia ,m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_maestro", "s", "m.id = s.material")
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockByUserAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.ubicacion as ubicacion ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->where("s.tecnico =".$user->getId())
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockByUserCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->where("s.tecnico =".$request->get("id"))
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockFromTecnicosAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,u.id as tecid , CONCAT (u.first_name ,' ', u.last_name ) as tecnico  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->leftJoin("s","users" ,"u","s.tecnico=u.id" )
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getStockByContratistaAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,u.first_name as nametec , u.last_name as apetec  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->innerJoin("s", "users", "u", "s.tecnico = u.id")
            ->innerJoin("u", "contratistas", "c", "u.contratista = c.id")
            ->where("c.id =".$request->get("id"))
            ->orderBy('u.id', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getAllStockContratistasAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("c.id as contratistaid , c.name as contratista , m.id as id ,u.first_name as nametec , u.last_name as apetec  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->innerJoin("s", "users", "u", "s.tecnico = u.id")
            ->innerJoin("u", "contratistas", "c", "u.contratista = c.id")
            ->orderBy('u.id', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getMaterialesStockBySiteCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        if ($request->get("id")==0){
            $stmt = $em->getConnection()->createQueryBuilder()
                ->select("sit.name as namesit ,m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
                ->from("stock_sitio", "s")
                ->innerJoin("s", "materiales", "m", "m.id = s.material")
                ->innerJoin("s", "sitios", "sit", "s.sitio = sit.id")
                ->orderBy('m.name', 'ASC')
                ->execute();
        }else{
            $stmt = $em->getConnection()->createQueryBuilder()
                ->select("sit.name as namesit ,m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
                ->from("stock_sitio", "s")
                ->innerJoin("s", "materiales", "m", "m.id = s.material")
                ->innerJoin("s", "sitios", "sit", "s.sitio = sit.id")
                ->where("s.sitio =".$request->get("id"))
                ->orderBy('m.name', 'ASC')
                ->execute();
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getAllStockSiteCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,s.sitio as sitioid , sit.name as namesit , m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_sitio", "s", "m.id = s.material")
            ->leftJoin("s", "sitios", "sit", "s.sitio = sit.id")
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }





    public function setStockUserAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $data=json_decode($request->getContent(),true);

        if(isset($data["user"])){
            // viene desde transferencia de tecnico a tecnico

            if($data["user"]=="login"){
                // viene de un usuario logeado a otro tec
                $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
            }else {
                // viene desde el administrador a otro tec
                $user_id=$data["user"];
            }
        }else {

            // viene desde transferencia desde maestro a tecnico
            $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
        }

        foreach ($data["items"] as $item){
            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockTecnico');
            $stock = $repo->findOneBy(array("material"=>$item['id'],"tecnico"=>$user_id));
            $stock->setCant($item['stock']);
            $em->flush();
        }

        /*if($data["user"]){
            $repoUsers =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
            $userOrigen=$repoUsers->findOneBy(array("id"=>$user_id));
            $userDestino=$repoUsers->findOneBy(array("id"=>$data["tecnico"]));


            $this->sendMailMovs($userOrigen->getLastName().' - '.$userOrigen->getFirstName(),"gabriel.adrian.felipe@gmail.com",new \DateTime(),$data["items"]);
        }else{
            $this->sendMailMovs("Stock Maestro","gabriel.adrian.felipe@gmail.com",new \DateTime(),$data["items"]);
        }*/



        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function setStockSitioAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $repoStockSit =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockSitio');
        $sitio=json_decode($request->getContent(),true)["sitio"];


        $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
        $stockTecMov= new MovStockTec();
        $stockTecMov->setState(1);
        $stockTecMov->setInicio(new \DateTime());
        $stockTecMov->setFin(new \DateTime());
        $stockTecMov->setOrigen($user_id);
        // movientos de tecnico a sitio

        $stockTecMov->setType(3);
        $stockTecMov->setTecnico($sitio);
        $em->persist($stockTecMov);
        $em->flush();



        foreach (json_decode($request->getContent(),true)["items"] as $item){
            $itemStockSit=$repoStockSit->findOneBy(array("sitio"=>$sitio,"material"=>$item['id']));
            if ($itemStockSit!=""){
                $itemStockSit->setCant($itemStockSit->getCant()+$item['stock']);
            }else{
                $StockSitio= new StockSitio();
                $StockSitio->setCant($item['stock']);
                $StockSitio->setSitio($sitio);
                $StockSitio->setMaterial($item['id']);
                $em->persist($StockSitio);
            }

            $stockItems= new StockItemsMov();
            $stockItems->setMaterial($item['id']);
            $stockItems->setMov($stockTecMov->getId());
            $stockItems->setCant($item['stock']);
            $em->persist($stockItems);

            $em->flush();
        }
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }











    private function getUsersToShowMovs(){
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $em = $this->getDoctrine()->getEntityManager();
        $childs=[];
        $childs[]=$user->getId(); // me paso yo mismo primero asi veo mis reportes
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("u.id as id,u.level as  level , u.bosses as bosses")
            ->from("users", "u")
            ->orderBy("u.username")
            ->execute();
        foreach ($stmt->fetchAll() as $users){

            //var_dump($users['bosses']);
            if (!empty($users['bosses']))
            {
                $bosses=json_decode($users['bosses']);
                //var_dump($bosses);
                //die();
                $is_son=false;
                foreach ($bosses as $boss){

                    if($boss==$user->getId()){
                        // es mi hijo
                        $is_son=true;
                    }
                }
                if($is_son){
                    $childs[]=(int)$users['id'];
                }
            }

        }
        return $childs;
    }

    /**
     * Trae todo los movimientos - para reportes
     * @return Response
     */

    public function getAllMovimientosAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $result=array();
        //var_dump($this->getUsersToShowMovs());
        //die();
        // tecsitid puede ser el tecnico id  o un sitio id por eso ese nombre

        //$queryBuilder->andWhere('r.winner IN (:ids)')
         //   ->setParameter('ids', $ids);

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("mov.id as id ,CONCAT (u.first_name ,' ',  u.last_name) 
            as tecnico,mov.tecnico as tecsitid, CONCAT (us.first_name ,' ', us.last_name) as origen ,
            mov.state as state ,mov.nota as nota ,mov.type as type,
            DATE_FORMAT(mov.fin, '%m-%d-%Y %h:%i') as fin ,
            DATE_FORMAT(mov.inicio, '%m-%d-%Y %h:%i') as inicio")
            ->from("movimiento_stock_tecnico", "mov")
            ->leftJoin("mov", "users", "u", "u.id = mov.tecnico")
            ->leftJoin("mov", "users", "us", "us.id = mov.origen")
            ->andWhere('u.id IN (:ids)')
            ->orWhere('us.id IN (:ids)')
            ->orderBy('mov.inicio', 'ASC')
            ->setParameter('ids', $this->getUsersToShowMovs(),\Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
            ->execute();



        foreach ($stmt->fetchAll() as $mov){
            $item=[];

            $stmtItems = $em->getConnection()->createQueryBuilder()
                ->select("st.id as id_item ,m.referencia as referencia,st.cant, m.id as id , m.id_custom as idCustom , m.descript as descript , m.name as name")
                ->from("stock_items_mov", "st")
                ->innerJoin("st", "materiales", "m", "st.material = m.id")
                ->where("st.mov = ".$mov['id'])
                ->orderBy('m.name', 'ASC')
                ->execute();
            $item['id']=$mov['id'];
            $item['items']=$stmtItems->fetchAll();
            $item['inicio']=$mov['inicio'];
            $item['fin']=$mov['fin'];

            $item['origen']=$mov['origen'];
            if($mov['type']==3){
                //necesito sacar el nombre del sitio
                $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Sitio');
                $sitio = $repo->findOneBy(array("id"=>$mov['tecsitid']));
                if ($sitio){
                    $item['tecnico']=$sitio->getName();
                }else{
                    $item['tecnico']="";
                }
            }else {
                $item['tecnico']=$mov['tecnico'];
            }

            $item['nota']=$mov['nota'];
            $item['state']=$mov['state'];
            $item['type']=$mov['type'];

            $result[]=$item;
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($result,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * Trae todo los movimientos x material- para reportes
     * @return Response
     */

    public function getAllMovimientosByMatAction($id){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("mst.nota as nota , concat(us1.last_name,' ',us1.first_name) as origen,concat(us.last_name,' ',us.first_name) as tecnico ,mst.inicio , mst.fin ,mst.state ,mst.type 
                ,item.cant as cantidad ,item.rechazado,item.obs")
            ->from("movimiento_stock_tecnico", "mst")
            ->innerJoin("mst", "stock_items_mov", "item", "item.mov = mst.id")
            ->innerJoin("mst", "users", "us", "us.id = mst.tecnico")
            ->innerJoin("mst", "users", "us1", "us1.id = mst.origen")
            ->andWhere('item.material='.$id)
            ->execute();

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }






}
