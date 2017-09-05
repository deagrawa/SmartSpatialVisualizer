package com.sap.pia.producer;

import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Response.StatusType;
import org.odata4j.core.OError;
import org.odata4j.producer.exceptions.ExceptionFactory;
import org.odata4j.producer.exceptions.ODataProducerException;

public class OdataException extends ODataProducerException {

  private static final long serialVersionUID = 1L;

  public OdataException() {
    this(null, null);
  }

  public OdataException(String message) {
    this(message, null);
  }

  public OdataException(Throwable cause) {
    this(null, cause);
  }

  public OdataException(String message, Throwable cause) {
    super(message, cause);
  }

  @Override
  public StatusType getHttpStatus() {
    return Status.FORBIDDEN;
  }

  OdataException(OError error) {
    super(error);
  }

  public static class Factory implements ExceptionFactory<OdataException> {

    @Override
    public int getStatusCode() {
      return Status.FORBIDDEN.getStatusCode();
    }

    @Override
    public OdataException createException(OError error) {
      return new OdataException(error);
    }
  }
}