import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { formatDateRange } from "@utils/formatDate";

export default function MissionCard({ mission, getMissionStatus }) {
  const status = getMissionStatus(mission.period.startDate, mission.period.endDate);
  const showApplyButton = true;

  const handleApply = () => {
    // A faire : formulaire pour postuler
  };

  return (
    <Card id={mission.id} className="h-100 shadow-sm yellow-border position-relative">
      <div className="position-absolute top-0 end-0 p-2">
        <Badge bg={status.color}>{status.label}</Badge>
      </div>
      <Card.Body>
        <Card.Title>{mission.title}</Card.Title>
        <Card.Text>{mission.description}</Card.Text>
        <Card.Text>
          <strong>Adresse:</strong><br />
          {mission.adress.streetNumber} {mission.adress.streetName},<br />
          {mission.adress.postalCode} {mission.adress.city}
        </Card.Text>
        <Card.Text>
          <strong>Période:</strong><br />
          {formatDateRange(mission.period.startDate, mission.period.endDate)}
        </Card.Text>
        <Card.Text>
          <strong>Bénévoles recherchés:</strong> {mission.nbVolunteerSearch}
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
      </Card.Body>
    </Card>
  );
}
