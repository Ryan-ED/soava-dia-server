/* publicQuery */

SELECT
    vehicle,
    vehicleModel,
    cooperative,
    (SELECT route.*,
      (SELECT meta(location).id, location.* FROM `soava-dia` location
    USE KEYS route.locations WHERE docType = "location" ) as locations
        FROM `soava-dia` route
        USE KEYS (SELECT RAW meta().id FROM `soava-dia` WHERE docType = "route")
        WHERE route.vehicleId = meta(vehicle).id) AS routes
FROM `soava-dia` vehicle
JOIN `soava-dia` cooperative ON KEYS vehicle.cooperativeId
JOIN `soava-dia` vehicleModel ON KEYS vehicle.vehicleModelId
WHERE vehicle.docType = "vehicle"
AND cooperative.docType = "cooperative"
AND vehicleModel.docType = "vehicleModel"
