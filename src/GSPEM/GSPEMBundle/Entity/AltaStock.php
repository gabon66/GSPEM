<?php

namespace GSPEM\GSPEMBundle\Entity;

/**
 * AltaStock
 */
class AltaStock
{
    /**
     * @var int
     */
    private $id;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }
    /**
     * @var string
     */
    private $obs;

    /**
     * @var integer
     */
    private $id_prov;

    /**
     * @var integer
     */
    private $stock;

    /**
     * @var integer
     */
    private $material;

    /**
     * @var \DateTime
     */
    private $date;


    /**
     * Set obs
     *
     * @param string $obs
     *
     * @return AltaStock
     */
    public function setObs($obs)
    {
        $this->obs = $obs;

        return $this;
    }

    /**
     * Get obs
     *
     * @return string
     */
    public function getObs()
    {
        return $this->obs;
    }

    /**
     * Set idProv
     *
     * @param integer $idProv
     *
     * @return AltaStock
     */
    public function setIdProv($idProv)
    {
        $this->id_prov = $idProv;

        return $this;
    }

    /**
     * Get idProv
     *
     * @return integer
     */
    public function getIdProv()
    {
        return $this->id_prov;
    }

    /**
     * Set stock
     *
     * @param integer $stock
     *
     * @return AltaStock
     */
    public function setStock($stock)
    {
        $this->stock = $stock;

        return $this;
    }

    /**
     * Get stock
     *
     * @return integer
     */
    public function getStock()
    {
        return $this->stock;
    }

    /**
     * Set material
     *
     * @param integer $material
     *
     * @return AltaStock
     */
    public function setMaterial($material)
    {
        $this->material = $material;

        return $this;
    }

    /**
     * Get material
     *
     * @return integer
     */
    public function getMaterial()
    {
        return $this->material;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return AltaStock
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }
}
