import { Card, Badge, Button } from "react-bootstrap";
import { formatMissionDateTime } from "@utils/formatDate";
import React,{ useState } from "react";
import { getMissionStatus } from "../utils/missionUtils";


export default function MissionCard({ mission, hideStatus = false }) {
  const [expanded, setExpanded] = useState(false);
  const status = getMissionStatus(mission.period.startDate, mission.period.endDate);
  const showApplyButton = false;

  const handleApply = () => {
    // A faire pour postuler
  };

  if (!expanded) {
    return (
      <Card id={mission.id} className="h-100 shadow-sm yellow-border position-relative">
        {!hideStatus && (
          <div className="position-absolute top-0 end-0 p-2">
            <Badge bg={status.color}>{status.label}</Badge>
          </div>
        )}
        <Card.Body>
          <Card.Title>{mission.title}</Card.Title>
          <Card.Text>
            <strong>Ville :</strong> {mission.address.city}
          </Card.Text>
          <div>
            {mission.missionSkillsTypeList.map((skill, idx) => (
              <span key={idx} className="badge me-1">
                {skill.label}
              </span>
            ))}
          </div>
          <Button
            className="mt-2"
            variant="primary"
            onClick={() => setExpanded(true)}
          >
            Voir les détails
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card id={mission.id} className="h-100 shadow-sm yellow-border position-relative">
      {!hideStatus && (
        <div className="position-absolute top-0 end-0 p-2">
          <Badge bg={status.color}>{status.label}</Badge>
        </div>
      )}
      <Card.Body>
        <Card.Title>{mission.title}</Card.Title>
        <Card.Text>{mission.description}</Card.Text>
        <Card.Text>
          <strong>Adresse:</strong><br />
          {mission.address.streetNumber} {mission.address.streetName},<br />
          {mission.address.postalCode} {mission.address.city}
        </Card.Text>
        <Card.Text>
          <strong>Période:</strong><br />
          {formatMissionDateTime(mission.period.startDate, mission.period.endDate)}
        </Card.Text>
        <Card.Text>
          <strong>Bénévoles recherchés:</strong> {mission.numberVolunteerSearch}
        </Card.Text>
        <row className="flex text-center">
          <div>
            {mission.missionSkillsTypeList.map((skill, idx) => (
              <span key={idx} className="badge me-1">
                {skill.label}
              </span>
            ))}
          </div>
          {showApplyButton && (
            <Button className="align-center" variant="success" onClick={handleApply}>
              Postuler
            </Button>
          )}
        </row>
        <Button
          className="mt-2"
          variant="secondary"
          onClick={() => setExpanded(false)} >
          Masquer les détails
        </Button>
      </Card.Body>
    </Card>
  );
}